import { handleApiError } from "@/utils/AxiosErrorHandler";
import axiosInstance from "@/utils/AxiosInstance";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";




export const getLeaderboard = async () => {
  try {
    const response = await axiosInstance.get("/leaderboard/getleaderboard");
    return response.data;
  } catch (err) {
    throw handleApiError(err);
  }
}

export const useGetLeaderboard = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['leaderboard'],
    queryFn: () => getLeaderboard(),
    enabled,
    retry: false,
    staleTime: 30000, // 30 seconds
  })
}