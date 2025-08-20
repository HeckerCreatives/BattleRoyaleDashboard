"use client"

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ReactNode, useState } from "react"
import { SquarePen, Trash } from "lucide-react"
import axios from "axios"
import { toast } from "@/components/ui/use-toast"
import { handleApiError } from "@/utils/ApiError"

interface ConfirmDialogProps {
    name: string
    id: string
   onSave: () => void

}

export function DeleteItemDialog({
    name,
    id,
    onSave
}: ConfirmDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

   const handleDelete = async () => {
    setLoading(true)
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/marketplace/admin/delete`, 
        { itemid: id },
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' },
        }
      )

      toast({
        variant: "default",
        title: "Item deleted",
        description: "Item has been successfully removed.",
        duration: 2000
      })

      onSave()
      setLoading(false)
      setOpen(false)
    } catch (error) {
      setLoading(false)
      handleApiError(error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className=" ">
         <Button className="gap-1 bg-red-600">
                 <Trash size={15}/>
                </Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-md">
        <DialogHeader>
          <DialogTitle>Delete ({name})</DialogTitle>
        </DialogHeader>
        <p className="py-2 text-sm text-zinc-400">Are you sure you want to delete the selected item?</p>
        <DialogFooter>
          <Button className=" bg-zinc-700" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant={'destructive'}
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Processing..." : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
