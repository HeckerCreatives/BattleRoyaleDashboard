import { handleApiError } from "@/utils/AxiosErrorHandler";
import axiosInstance from "@/utils/AxiosInstance";
import { useDebounce } from "@/utils/debounce";
import { GrantSchema } from "@/validations/grant";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// ─── User ─────────────────────────────────────────────────────────────────────

export type UserStatus = 'active' | 'inactive' | 'banned'

export interface Player {
  id: string
  username: string
  status: UserStatus
  email: string
  country: string
  createdAt: string
}

// ─── API Response ─────────────────────────────────────────────────────────────

export interface PlayerData {
  totalPages: number
  userlist: Player[]
}

export interface PlayerList {
  message: string
  data: PlayerData
}
const grantUser = async (data: any) => {
  const response = await axiosInstance.post("/reward/grantrewards", data);
  return response.data;
};

export const useGrantUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => grantUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quests"] });
    },
    onError: (error) => {
      console.error("Failed to create quest:", error);
    },
  });
};

export const getUser = async (search: string): Promise<PlayerList> => {
  try {
    const response = await axiosInstance.get(`/user/getplayerlist`, {
      params: { page: 0, limit: 10, search },
    })
    return response.data
  } catch (err) {
    throw handleApiError(err)
  }
}

export const useGetUser = (search: string) => {
  const debouncedSearch = useDebounce(search, 400)

  return useQuery({
    queryKey: ['players', debouncedSearch],
    queryFn: () => getUser(debouncedSearch),
    retry: false,
  })
}


