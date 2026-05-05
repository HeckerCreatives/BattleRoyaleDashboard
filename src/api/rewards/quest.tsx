import { handleApiError } from "@/utils/AxiosErrorHandler";
import axiosInstance from "@/utils/AxiosInstance";
import { QuestSchema } from "@/validations/quest";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const VALID_QUEST_TYPES = ["MATCH", "WIN", "KILL", "USE_ITEM", "WATCH_ADS"] as const;
export const VALID_REWARD_TYPES = ["exp", "leaderboard", "energy", "potion", "title"] as const;

export type RewardType = 'exp' | 'leaderboard' | "energy" | "potion" | "title" | "item"

export interface Reward {
  _id: string
  type: any
  amount: number
  itemid: string
}


export type QuestType = 'MATCH' | 'WIN' | 'KILL' | 'USE_ITEM' | 'WATCH_ADS' 

export interface Quest {
  _id: string
  questid: string
  title: string
  description: string
  type: QuestType
  target: number
  rewards: Reward[]
  isSkippable: boolean
  isActive: boolean
  __v: number
  createdAt: string
  updatedAt: string
}


export interface GetAllQuestsResponse {
  message: string
  data: Quest[]
}


export type RewardPayload = Omit<Reward, '_id'>

export interface QuestFormData {
  questid?: string        // omit on create, required on update
  title: string
  description: string
  type: QuestType
  target: number
  rewards: RewardPayload[]
  isSkippable: boolean
  isActive: boolean
}

export interface UpdateQuestPayload extends QuestFormData {
  questid: string
}

export interface Item {
  itemid: string
  itemname: string
  description: string
  amount: number
  currency: 'points' | 'coins' | string,
  type: string
}

export interface ItemsResponse {
  data: Item[]
}

export const getQuests = async ():Promise<GetAllQuestsResponse> => {
  try {
    const response = await axiosInstance.get("/quest/getallquests");
    return response.data;
  } catch (err) {
    throw handleApiError(err);
  }
}

export const useGetQuests = () => {
  return useQuery({
    queryKey: ['quests'],
    queryFn: () => getQuests(),
    retry: true,
  })
}

export const getRewardItems = async ():Promise<ItemsResponse> => {
  try {
    const response = await axiosInstance.get("/marketplace/items");
    return response.data;
  } catch (err) {
    throw handleApiError(err);
  }
}

export const useGetRewardItems = () => {
  return useQuery({
    queryKey: ['items'],
    queryFn: () => getRewardItems(),
    retry: false,
  })
}


const createQuest = async (data: QuestSchema) => {
  const response = await axiosInstance.post("/quest/createquest", data);
  return response.data;
};

export const useCreateQuest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: QuestSchema) => createQuest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quests"] });
    },
    onError: (error) => {
      console.error("Failed to create quest:", error);
    },
  });
};

const editQuest = async (data: QuestSchema) => {
  const response = await axiosInstance.post("/quest/updatequest", data);
  return response.data;
};

export const useEditQuest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: QuestSchema) => editQuest(data),
  
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quests"] });
    },
    onError: (error) => {
      console.error("Failed to create quest:", error);
    },
  });
};


const deleteQuest = async (id: string, questid: string) => {
  const response = await axiosInstance.post("/quest/deletequest", {id, questid});
  return response.data;
};

export const useDeleteQuest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({id, questid}:{id: string, questid: string}) => deleteQuest(id, questid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quests"] });
    },
    onError: (error) => {
      console.error("Failed to create quest:", error);
    },
  });
};



