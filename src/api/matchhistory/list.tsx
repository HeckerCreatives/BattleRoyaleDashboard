
import { handleApiError } from "@/utils/AxiosErrorHandler";
import axiosInstance from "@/utils/AxiosInstance";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface MatchHistoryParams {
    page: number;
    limit: number;
}


export const getViewMatchHistory = async (params: MatchHistoryParams) => {
    try {
        const response = await axiosInstance.get("/matchhistory/viewmatchhistory", { params });
        return response.data;
    } catch (err) {
        throw handleApiError(err);
    }
}

export const useGetViewMatchHistory = (params: MatchHistoryParams, enabled: boolean = true) => {
    return useQuery({
        queryKey: ['viewMatchHistory', params.page, params.limit],
        queryFn: () => getViewMatchHistory(params),
        enabled,
        retry: false,
        staleTime: 30000, // 30 seconds
    })
}