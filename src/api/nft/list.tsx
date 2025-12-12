import { Contract, formatUnits, JsonRpcProvider, Interface } from 'ethers';
// import { btmarket, btnft } from '@/contracts/configuration';
// import Market from '@/contracts/market.json';
// import NFT from '@/contracts/nft.json';
import market from '../../contracts/marketplace/Marketplace.json';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface NFTItem {
  price: string;
  tokenId: number;
  seller: string;
  image: string;
  name: string;
  description: string;
  listed?: boolean;
  inventoryId?: string;
}

async function fetchAvailableNFTs(): Promise<NFTItem[]> {
  try {
    const provider = new JsonRpcProvider('https://bsc-prebsc-dataseed.bnbchain.org');
    const contractAddress = "0xE4F69Ed29813E0a6Fc4029B4A5e1C6ea273b6638"; //process.env.NFT_CONTRACT_ADDRESS;
    if (!contractAddress) {
      throw new Error('NFT_CONTRACT_ADDRESS environment variable is not defined');
    }
    const marketContract = new Contract(contractAddress, market, provider);

    const resp = await marketContract.getActiveListings();

    // resp.map with async returns an array of Promises — await them with Promise.all
    const data = await Promise.all(resp.map(async (tokenid: any) => {
      const tid = typeof tokenid.toNumber === 'function' ? tokenid.toNumber() : Number(tokenid);

      // tokenURI is already formatted (ipfs:// or https://), use it directly
      const tokenUri: string = await marketContract.tokenURI(tokenid);
      const listingData = await marketContract.listings(tokenid);
      const metaRes = await axios.get(tokenUri);
      const meta = metaRes.data || {};

      const price = formatUnits(listingData.price.toString(), 'ether');

      return {
        tokenId: tid,
        seller: listingData.seller,
        image: meta.image,
        name: meta.name,
        description: meta.description,
        listed: true,
        price,
      } as NFTItem;
    }));

    return data;
  } catch (error) {
    console.error('Error loading NFTs:', error);
    throw error;
  }
}

export const useGetAvailableNFTs = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['marketplace', 'available-nfts'],
    queryFn: () => fetchAvailableNFTs(),
    enabled,
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: false,
  });
}

// Helper to resolve ipfs:// URIs to an HTTP gateway
function resolveIPFS(uri: string): string {
  if (!uri) return uri;
  if (uri.startsWith('ipfs://')) {
    return uri.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/');
  }
  return uri;
}

// --- Fetch NFTs owned by a wallet ---
export async function fetchMyNFTs(owner: string): Promise<NFTItem[]> {
  try {
    if (!owner) return [];
    const provider = new JsonRpcProvider('https://bsc-prebsc-dataseed.bnbchain.org');
    const contractAddress = "0xE4F69Ed29813E0a6Fc4029B4A5e1C6ea273b6638"; // ensure this matches deployed address
    const marketContract = new Contract(contractAddress, market, provider);

    const resp: any[] = await marketContract.walletOfOwner(owner);

    const data = await Promise.all(resp.map(async (tokenid: any) => {
      const tid = typeof tokenid.toNumber === 'function' ? tokenid.toNumber() : Number(tokenid);

      let tokenUriRaw: string = '';
      try {
        tokenUriRaw = await marketContract.tokenURI(tid);
      } catch (e) {
        tokenUriRaw = '';
      }

      const tokenUri = resolveIPFS(tokenUriRaw);

      let meta: any = {};
      if (tokenUri) {
        try {
          const metaRes = await axios.get(tokenUri);
          meta = metaRes.data || {};
        } catch (e) {
          meta = {};
        }
      }

      const listingData: any = await marketContract.listings(tid);
      const isListed = listingData ? Boolean(listingData.active) : false;
      const price = isListed ? formatUnits(listingData.price.toString(), 'ether') : '0';

      return {
        tokenId: tid,
        seller: listingData ? listingData.seller : owner,
        image: meta.image,
        name: meta.name,
        description: meta.description,
        listed: isListed,
        price,
      } as NFTItem;
    }));

    return data;
  } catch (error) {
    console.error('Error loading my NFTs:', error);
    throw error;
  }
}

export const useGetMyNFTs = (owner?: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['marketplace', 'my-nfts', owner],
    queryFn: () => fetchMyNFTs(owner!),
    enabled: !!owner && enabled,
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });
}