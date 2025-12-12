import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
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

// Export the function for direct use in other mutations
export { mintInventoryItem };
