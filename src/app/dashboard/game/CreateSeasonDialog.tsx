"use client"

import { useState } from "react"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Loader2 } from "lucide-react"
import api from "@/lib/axios"
import axios, { AxiosError } from "axios"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

interface Props {
  onSave: () => void
}

export function CreateSeasonDialog({ onSave }: Props) {
  const [title, setTitle] = useState("")
  const [duration, setDuration] = useState(0)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleCreate = async () => {
    try {
      setLoading(true)

     const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/season/createseason`, {
        title,
        duration,
        status: "upcoming",
      }, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
      })

      onSave()
      setTitle("")
      setDuration(30)
      setOpen(false)
    } catch (error) {
      setOpen(false)

      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string; data: string }>
        if (axiosError.response && axiosError.response.status === 401) {
          router.push("/")
          toast({
            variant: "destructive",
            title: `${axiosError.response.data.message}`,
            description: `${axiosError.response.data.data}`,
          })
        }

        if (axiosError.response && axiosError.response.status === 400) {
          toast({
            variant: "destructive",
            title: `${axiosError.response.data.message}`,
            description: `${axiosError.response.data.data}`,
          })
        }
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-1">
          <Plus size={15} /> Create
        </Button>
      </DialogTrigger>
      <DialogContent className="text-white p-6 max-w-md bg-zinc-900 border-zinc-800">
        <DialogHeader>
          <DialogTitle>Create New Season</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            className="bg-zinc-800 placeholder:text-zinc-600"
            placeholder="Season title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input
            className="bg-zinc-800 placeholder:text-zinc-600"
            type="number"
            placeholder="Duration (days)"
            value={duration}
            onChange={(e) => setDuration(e.target.valueAsNumber)}
          />
        </div>
        <DialogFooter>
          <Button onClick={handleCreate} disabled={loading}>
            {loading && <Loader2 size={16} className="animate-spin mr-2" />}
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
