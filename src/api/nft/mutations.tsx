import { Contract, BrowserProvider, parseUnits } from 'ethers';
import { useMutation } from "@tanstack/react-query";
import { handleApiError } from "@/utils/AxiosErrorHandler";
import market from '../../contracts/marketplace/Marketplace.json';
import axios from 'axios';
import { mintInventoryItem } from '../inventory/mutations';
import axiosInstance from "@/utils/AxiosInstance";

const contractAddress = "0xE4F69Ed29813E0a6Fc4029B4A5e1C6ea273b6638";

// Pinata Helper Functions
async function uploadMetadata(metadata: object): Promise<any> {
  const resp = await axiosInstance.post('/pinata/uploadmetadata', { metadata });
  console.log(resp.data.data.ipfsHash);
  if (!resp?.data?.data?.ipfsHash) throw new Error('Pin failed');
  return resp.data.data.ipfsHash;
}

async function unpinMetadata(ipfsHash: string): Promise<boolean> {
  try {
    const resp = await axiosInstance.post('/pinata/unpin', { ipfsHash });
    return resp.status >= 200 && resp.status < 300;
  } catch (err) {
    console.error('Failed to unpin:', err);
    return false;
  }
}

// Cancel Listing
const cancelListing = async (tokenId: number) => {
  if (!window.ethereum) throw new Error('No wallet found');
  
  await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
  const provider = new BrowserProvider(window.ethereum as any);
  const signer = await provider.getSigner();
  const contract = new Contract(contractAddress, market, signer);
  const tx = await contract.cancelListing(tokenId);
  await tx.wait();
  
  return { tokenId };
};

export const useCancelListing = () => {
  return useMutation({
    mutationFn: ({ tokenId }: { tokenId: number }) =>
      cancelListing(tokenId),
    onError: (error) => {
      handleApiError(error);
    },
  });
};

// Buy NFT
const buyNFT = async (tokenId: number, price: string) => {
  if (!window.ethereum) throw new Error('No wallet found');
  
  await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
  const provider = new BrowserProvider(window.ethereum as any);
  const signer = await provider.getSigner();
  const contract = new Contract(contractAddress, market, signer);
  const value = parseUnits(price || '0', 'ether');
  const tx = await contract.buy(tokenId, { value });
  await tx.wait();
  
  return { tokenId, price };
};

export const useBuyNFT = () => {
  return useMutation({
    mutationFn: ({ tokenId, price }: { tokenId: number; price: string }) =>
      buyNFT(tokenId, price),
    onError: (error) => {
      handleApiError(error);
    },
  });
};


type MintParams = {
  tokenId: number;
  metadata: object; // JSON metadata to pin
  inventoryId: string;
  targetWallet?: string; // Optional: target wallet for backend
};

const mintNFT = async ({ tokenId, metadata, inventoryId, targetWallet }: MintParams) => {
  if (!window.ethereum) throw new Error('No wallet found');
  if (!inventoryId) throw new Error('Inventory ID is required for minting');
  await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
  const provider = new BrowserProvider(window.ethereum as any);
  const signer = await provider.getSigner();
  const contract = new Contract(contractAddress, market, signer);
  const walletAddress = await signer.getAddress();

  // Pre-flight checks
  const saleActive = await contract.saleActive();
  if (!saleActive) {
    throw new Error('Sale is not active. Contact admin to activate sale.');
  }

  // Check if token already exists
  try {
    await contract.ownerOf(tokenId);
    throw new Error(`Token #${tokenId} is already minted`);
  } catch (err: any) {
    // If ownerOf throws, token doesn't exist - this is good
    if (!err.message?.includes('already minted')) {
      // Token doesn't exist, continue
    } else {
      throw err;
    }
  }

  // Check wallet mint limit
  const mintedCount = await contract.mintedCount(walletAddress);
  const maxPerWallet = await contract.maxPerWallet();
  if (mintedCount >= maxPerWallet) {
    throw new Error(`Wallet limit reached: ${mintedCount}/${maxPerWallet} mints`);
  }

  // Check max supply
  const maxSupply = await contract.maxSupply();
  const totalSupply = await contract.totalSupply();
  if (BigInt(tokenId) + BigInt(1) > maxSupply) {
    throw new Error(`Token ID ${tokenId} exceeds max supply of ${maxSupply.toString()}`);
  }
  if (totalSupply >= maxSupply) {
    throw new Error(`Collection sold out: ${totalSupply}/${maxSupply}`);
  }

  // 1) Pin metadata via external Express Pinata service
  const ipfsHash = await uploadMetadata(metadata);
  const tokenUri = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;

  // 2) Fetch mint price from contract (view)
  const mintPrice = await contract.mintPrice();

  // 3) Mint on blockchain FIRST (safer - only proceed if NFT exists on-chain)
  try {
    const tx = await contract.mintPublic(tokenId, tokenUri, { value: mintPrice });
    await tx.wait();
  } catch (err) {
    await unpinMetadata(ipfsHash); // cleanup pinned metadata on failure
    console.error('Minting failed, unpinned metadata:', err);
    throw err;
  }

  // 4) Register in backend inventory AFTER successful blockchain mint
  let backendRegistered = false;
  let mintedItemId = null;
    try {
      const result = await mintInventoryItem({
        inventoryId,
        quantity: 1,
        metadataUri: tokenUri,
        targetWallet: targetWallet || walletAddress,
      });
      backendRegistered = true;
      mintedItemId = result.inventoryId;
    } catch (err) {
      console.error('Backend inventory registration failed (non-critical):', err);
      // NFT is already minted on-chain, backend sync can be done manually later
    }

  return { tokenId, tokenUri, backendRegistered, mintedItemId };
};

export const useMintNFT = () => {
  return useMutation({
    mutationFn: ({ tokenId, metadata, inventoryId }: MintParams) => mintNFT({ tokenId, metadata, inventoryId, targetWallet: undefined }),
    onError: (error) => {
      handleApiError(error);
    },
  });
};

const listNFT = async (tokenId: number, price: string) => {
  if (!window.ethereum) throw new Error('No wallet found');
    await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
    const provider = new BrowserProvider(window.ethereum as any);
    const signer = await provider.getSigner();
    const contract = new Contract(contractAddress, market, signer);
    const priceInWei = parseUnits(price, 'ether');
    const tx = await contract.listNFT(tokenId, priceInWei);
    await tx.wait();
    return { tokenId, price };
};

export const useListNFT = () => {
  return useMutation({
    mutationFn: ({ tokenId, price }: { tokenId: number; price: string }) =>
      listNFT(tokenId, price),
    onError: (error) => {
      handleApiError(error);
    },
  });
};


const giftNFT = async (tokenId: number, targetWallet: string) => {
  if (!window.ethereum) throw new Error('No wallet found');
  if (!targetWallet || targetWallet.length !== 42 || !targetWallet.startsWith('0x')) {
    throw new Error('Invalid target wallet address');
  }
  
  await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
  const provider = new BrowserProvider(window.ethereum as any);
  const signer = await provider.getSigner();
  const contract = new Contract(contractAddress, market, signer);
  
  // Verify ownership
  const owner = await contract.ownerOf(tokenId);
  const signerAddress = await signer.getAddress();
  if (owner.toLowerCase() !== signerAddress.toLowerCase()) {
    throw new Error('You are not the owner of this NFT');
  }
  
  const tx = await contract.gift(targetWallet, tokenId);
  await tx.wait();
  
  return { tokenId, targetWallet };
};

export const useGiftNFT = () => {
  return useMutation({
    mutationFn: ({ tokenId, targetWallet }: { tokenId: number; targetWallet: string }) =>
      giftNFT(tokenId, targetWallet),
    onError: (error) => {
      handleApiError(error);
    },
  });
};