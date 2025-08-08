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
import { Textarea } from "@/components/ui/textarea"

interface Props {
  onSave: () => void
}

export function CreateTitleDialog({ onSave }: Props) {
  const [title, setTitle] = useState("")
   const [index, setIndex] = useState(0)
    const [description, setDescription] = useState('')
  
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleCreate = async () => {
    try {
      setLoading(true)

     const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/title/create`, {
        name: title,
        index: index,
        description: description,
      }, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
      })

      toast({
            variant: "default",
            title: `Success`,
            description: `Successfully created`,
        duration: 2000

          })

      onSave()
      setTitle("")
      setDescription('')
      setIndex(0)
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
        duration: 2000

          })
        }

        if (axiosError.response && axiosError.response.status === 400) {
          toast({
            variant: "destructive",
            title: `${axiosError.response.data.message}`,
            description: `${axiosError.response.data.data}`,
        duration: 2000

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
          <DialogTitle>Create Title</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <p >Index</p>
           <Input
            className="bg-zinc-800 placeholder:text-zinc-600"
            placeholder="Title index"
            value={index}
            type="number"
            onChange={(e) => setIndex(e.target.valueAsNumber)}
          />
          <p className=" mt-3">Title</p>

          <Input
            className="bg-zinc-800 placeholder:text-zinc-600"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <p  className=" mt-3">Description</p>

          <Textarea
            className="bg-zinc-800 placeholder:text-zinc-600"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
