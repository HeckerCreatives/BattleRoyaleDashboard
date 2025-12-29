import { handleApiError } from "@/utils/AxiosErrorHandler";
import axiosInstance from "@/utils/AxiosInstance";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// --- Types ---
export interface ItemDetail {
  _id: string;
  itemname: string;
  description: string;
  amount: string;
  currency: string;
  type: string;
  ipfsImage: string;
  canBeMintedAsNFT: boolean;
  rarity: string;
}

export interface InventoryEntry {
  _id: string;
  tokenId: number;
  owner: string;
  item: ItemDetail;
  itemid: string;
  itemname: string;
  type: string;
  quantity: number;
  isEquipped: boolean;
  ipfsImage: string;
  isMintable: boolean;
  isMinted: boolean;
  isListed: boolean;
  isTransferable: boolean;
  transferHistory: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface Summary {
  totalQuantity: number;
  displayedItems: number;
}

export interface InventoryData {
  inventory: InventoryEntry[];
  pagination: Pagination;
  summary: Summary;
}

export interface GetMyInventoryResponse {
  message: string;
  data: InventoryData;
}

export type GetMyInventoryParams = {
  page?: number | string;
  limit?: number | string;
  rarity?: string;
  type?: string;
  includeNFTs?: 'true' | 'false' | boolean | string;
  includeListed?: 'true' | 'false' | boolean | string;
  sort?: string;
};

export type getNFTActivityHistoryParams = {
  page?: number | string;
  limit?: number | string;
  tokenId?: number | string;
  activityType?: string;
};

// Token Details Types
export interface TokenDetailsResponse {
  message: string;
  data: {
    id: string;
    tokenId: number;
    itemname: string;
    type: string;
    quantity: number;
    ipfsImage: string;
    owner: {
      userId: string;
      username: string;
      walletAddress: string;
      email: string;
    };
    itemDetails: {
      itemname: string;
      description: string;
      type: string;
      rarity: string;
      canBeMintedAsNFT: boolean;
      ipfsImage: string;
    } | null;
    status: {
      isEquipped: boolean;
      isMintable: boolean;
      isMinted: boolean;
      isListed: boolean;
      isTransferable: boolean;
    };
    nftData: any;
    marketplaceListing: any;
    listingData: any;
    transferHistory: any[];
    recentActivity: any[];
    createdAt: string;
    updatedAt: string;
    _id: string; // This is the inventoryId
  };
}

const getMyInventory = async (params?: GetMyInventoryParams): Promise<GetMyInventoryResponse> => {
  try {
    const response = await axiosInstance.get<GetMyInventoryResponse>("/inventory/getmyinventory", { params });
    return response.data;
  } catch (err) {
    throw handleApiError(err);
  }
}

export const useGetMyInventory = (params?: GetMyInventoryParams, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['getMyInventory', params],
    queryFn: () => getMyInventory(params),
    enabled,
    retry: false,
  })
}


export const getNFTActivityHistory = async (params?: getNFTActivityHistoryParams) => {
  try {
    const response = await axiosInstance.get("/inventory/nftactivity", { params });
    return response.data;
  } catch (err) {
    throw handleApiError(err);
  }
}

export const useGetNFTActivityHistory = (params?: getNFTActivityHistoryParams, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['nftActivityHistory', params],
    queryFn: () => getNFTActivityHistory(params),
    enabled,
    retry: false,
    staleTime: 30000, // 30 seconds
  })
}

// Get Token Details by TokenId
const getTokenDetails = async (tokenId: number): Promise<TokenDetailsResponse> => {
  try {
    const response = await axiosInstance.get<TokenDetailsResponse>("/inventory/token", { 
      params: { tokenId } 
    });
    return response.data;
  } catch (err) {
    throw handleApiError(err);
  }
}

export const useGetTokenDetails = (tokenId: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['tokenDetails', tokenId],
    queryFn: () => getTokenDetails(tokenId),
    enabled: enabled && tokenId > 0,
    retry: false,
    staleTime: 30000, // 30 seconds
  })
}