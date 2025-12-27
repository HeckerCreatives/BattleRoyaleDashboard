import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { handleApiError } from '@/utils/AxiosErrorHandler';
import axiosInstance from '@/utils/AxiosInstance';

type MintItemParams = {
  inventoryId: string;
  quantity?: number;
  metadataUri?: string | object;
  targetWallet?: string;
};

type MintItemResponse = {
  inventoryId: string;
  tokenUris: string[];
  targetWallet?: string | null;
};

async function mintInventoryItem(params: MintItemParams): Promise<MintItemResponse> {
  const resp = await axiosInstance.post('/inventory/mintitem', params);
  if (!resp?.data) throw new Error('Mint service error');
  return resp.data as MintItemResponse;
}

export const useMintInventoryItem = () => {
  return useMutation({
    mutationFn: (params: MintItemParams) => mintInventoryItem(params),
    onError: (error) => {
      handleApiError(error);
    },
  });
};

async function listInventoryItem(inventoryId: string, price: string) {
  const resp = await axiosInstance.post('/inventory/listnft', { inventoryId, price });
  if (!resp?.data) throw new Error('List service error');
  return resp.data;
}

export const useListInventoryItem = () => {
  return useMutation({
    mutationFn: ({ inventoryId, price }: { inventoryId: string; price: string }) => listInventoryItem(inventoryId, price),
    onError: (error) => {
      handleApiError(error);
    }
  });
}

async function giftNFT(inventoryId: string, recipientWalletAddress: string) {
  const resp = await axiosInstance.post('/inventory/giftnft', { inventoryId, recipientWalletAddress });
  if (!resp?.data) throw new Error('Gift service error');
  return resp.data;
}

export const useGiftNFT = () => {
  return useMutation({
    mutationFn: ({ inventoryId, recipientWalletAddress }: { inventoryId: string; recipientWalletAddress: string }) => giftNFT(inventoryId, recipientWalletAddress),
    onError: (error) => {
      handleApiError(error);
    }
  })
}

// Check which tokenIds are already owned/linked in backend
async function checkOwnedTokens(tokenIds: number[]) {
  const resp = await axiosInstance.post('/inventory/check-owned', { tokenIds });
  if (!resp?.data) throw new Error('Check service error');
  // Backend returns { message: "success", data: { owned: number[] } }
  return resp.data.data as { owned: number[] };
}

export const useCheckOwnedTokens = (tokenIds?: number[], enabled: boolean = !!(tokenIds && tokenIds.length)) => {
  return useQuery({
    queryKey: ['inventory', 'checkOwned', tokenIds || []],
    queryFn: () => checkOwnedTokens(tokenIds || []),
    enabled,
    retry: false,
  });
};

// Claim/bridge an on-chain NFT to link it to the user's account
async function claimInventoryItem(tokenId: number, walletAddress: string) {
  const resp = await axiosInstance.post('/inventory/claim', { tokenId, walletAddress });
  if (!resp?.data) throw new Error('Claim service error');
  return resp.data;
}

export const useClaimInventory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tokenId, walletAddress }: { tokenId: number; walletAddress: string }) => claimInventoryItem(tokenId, walletAddress),
    onError: (error) => {
      handleApiError(error);
    },
    onSuccess: () => {
      // Refresh all inventory and NFT queries
      qc.invalidateQueries({ queryKey: ['getMyInventory'] });
      qc.invalidateQueries({ queryKey: ['getMyNFTs'] });
      qc.invalidateQueries({ queryKey: ['inventory', 'checkOwned'] });
    },
  });
};

export { mintInventoryItem, listInventoryItem, giftNFT, checkOwnedTokens, claimInventoryItem };


