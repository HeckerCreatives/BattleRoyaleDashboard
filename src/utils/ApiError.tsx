import { toast } from "@/components/ui/use-toast";
import axios, { AxiosError } from "axios";
import router from "next/router";

export const handleApiError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string; data: string }>
        const status = axiosError.response?.status
        const message = axiosError.response?.data.message
        const description = axiosError.response?.data.data

        if (status === 401) {
        router.push("/")
        }

        toast({
        variant: "destructive",
        title: message || "Error",
        description: description || "Something went wrong.",
        })
    }

    }