import { handleApiError } from "@/utils/AxiosErrorHandler";
import axiosInstance from "@/utils/AxiosInstance";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";




export const resetWatchAds = async () => {
  try {
    const response = await axiosInstance.post("/quest/resetallwatchads");
    return response.data;
  } catch (err) {
    throw handleApiError(err);
  }
}

export const resetQuest = async () => {
  try {
    const response = await axiosInstance.post("/quest/resetallquestprogress");
    return response.data;
  } catch (err) {
    throw handleApiError(err);
  }
}

