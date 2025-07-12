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

interface ConfirmDialogProps {
  title: string
  description: string
  onConfirm: () => void
  trigger: ReactNode
  confirmLabel?: string
  danger?: boolean
}

export function ConfirmDialog({
  title,
  description,
  onConfirm,
  trigger,
  confirmLabel = "Confirm",
  danger = false,
}: ConfirmDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    setLoading(true)
    await onConfirm()
    setLoading(false)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <p className="py-2 text-sm text-zinc-400">{description}</p>
        <DialogFooter>
          <Button className=" bg-zinc-700" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant={danger ? "destructive" : "default"}
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? "Processing..." : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
