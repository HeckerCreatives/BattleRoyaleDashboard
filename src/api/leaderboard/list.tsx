import { handleApiError } from "@/utils/AxiosErrorHandler";
import axiosInstance from "@/utils/AxiosInstance";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface LeaderboardResponse {
  message: string;
  data: {
    leaderboard: {
      [key: string]: LeaderboardEntry;
    };
    pagination: {
      totalDocuments: number,
      totalPages: number,
      currentPage: number,
      hasNextPage: boolean,
      hasPrevPage: boolean
    },
    userStats: {
      totalWins: number,
      totalMatches: number,
      playTime: number
    }
  };
}

export interface LeaderboardEntry {
  user: string;
  amount: number;
  totalWins: number;
  totalMatches: number;
  playTime: number;
}


export const getLeaderboardHistory = async (page: number, limit: number, type?: string): Promise<LeaderboardResponse> => { 
    try {
    const response = await axiosInstance.get(
        "/leaderboard/getleaderboardsa",{params:{page, limit, type}}
    )
    return response.data
    } catch (error) {
        handleApiError(error)
        throw error 
    }
  
};

export const useGetLeaderboardHistory = (page: number, limit: number, type?: string) => {
  return useQuery({
    queryKey: ["leaderboard-history",page, limit, type],
    queryFn: () => getLeaderboardHistory(page, limit, type),
    retry: false,
  });
};