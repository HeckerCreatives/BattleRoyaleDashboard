"use client"

import { useEffect, useState } from "react"
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
import { SquarePen, Loader2 } from "lucide-react"
import api from "@/lib/axios"
import { Season } from "./Season"
import { toast } from "@/components/ui/use-toast"
import axios, { AxiosError } from "axios"
import { useRouter } from "next/navigation"

interface Props {
  season: Season
  onSave: () => void
}

export function EditSeasonDialog({ season, onSave }: Props) {
  const [title, setTitle] = useState(season.title)
  const [duration, setDuration] = useState(season.duration)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (open) {
      setTitle(season.title)
      setDuration(season.duration)
    }
  }, [open, season])

  const handleUpdate = async () => {
    try {
      setLoading(true)
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/season/updateseason`, {
        seasonId: season._id,
        title,
        duration,
        status: season.status,
      },{
         withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
      })
      

      onSave()
      setOpen(false)

      toast({
        variant: "default",
        title: "Success",
        description: `Season updated successfully`,
      })
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string; data: string }>
        if (axiosError.response && axiosError.response.status === 401) {
          router.push("/")
          toast({
            variant: "destructive",
            title: axiosError.response.data.message,
            description: axiosError.response.data.data,
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
        <Button variant="default" size="sm" className="gap-1">
          <SquarePen size={15} /> Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="text-white p-6 max-w-md bg-zinc-900 border-zinc-800">
        <DialogHeader>
          <DialogTitle>Edit Season</DialogTitle>
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
          <Button onClick={handleUpdate} disabled={loading}>
            {loading && <Loader2 size={16} className="animate-spin mr-2" />}
            Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
