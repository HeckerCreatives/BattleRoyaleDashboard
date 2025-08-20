"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import axios from "axios"
import { toast } from "@/components/ui/use-toast"
import { Loader2, Plus } from "lucide-react"

export interface MarketplaceItem {
  itemid: string
  itemname: string
  description?: string
  amount: number
  currency: "coins" | "points"
  type: string
  consumable?: any
}

interface MarketplaceItemDialogProps {
  trigger?: React.ReactNode
  initialData?: Partial<MarketplaceItem>
   onSuccess?: () => void
   onSave: () => void
}

export function MarketplaceItemDialog({ trigger, initialData, onSuccess, onSave }: MarketplaceItemDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<MarketplaceItem>({
    itemid: initialData?.itemid || "",
    itemname: initialData?.itemname || "",
    description: initialData?.description || "",
    amount: initialData?.amount || 0,
    currency: initialData?.currency || "coins",
    type: initialData?.type || "",
    consumable: initialData?.consumable || 0,
  })

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.itemid || !formData.itemname || !formData.type || formData.amount <= 0) {
        toast({
             variant: "destructive",
             title: `Error`,
             description: `Please fill all the required fields.`,
            duration: 2000
      
    })
    }

    try {
      setLoading(true)

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/marketplace/admin/create`, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
      })

        toast({
             variant: "default",
             title: `Success`,
             description: `Successfully created`,
            duration: 2000
      
    })

    if (onSuccess) onSuccess()
    setOpen(false)
    onSave()

      if (!initialData) {
        setFormData({
          itemid: "",
          itemname: "",
          description: "",
          amount: 0,
          currency: "coins",
          type: "",
          consumable: "0",
        })
      }
    } catch (err) {
      console.error("Error creating marketplace item:", err)
    } finally {
      setLoading(false)
    }
  }

  const updateField = (field: keyof MarketplaceItem, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || <Button><Plus size={15}/>Add</Button>}</DialogTrigger>
      <DialogContent className=" max-w-md bg-zinc-950 text-white border-zinc-700">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Marketplace Item" : "Add Marketplace Item"}</DialogTitle>
          <DialogDescription>
            Fill in the details for your marketplace item. Required fields are marked with *.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="itemid">Item ID *</label>
              <Input
                id="itemid"
                value={formData.itemid}
                onChange={(e) => updateField("itemid", e.target.value)}
                placeholder="unique-item-id"
                required
                className="bg-zinc-800 placeholder:text-zinc-600"
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="itemname">Item Name *</label>
              <Input
                id="itemname"
                value={formData.itemname}
                onChange={(e) => updateField("itemname", e.target.value)}
                placeholder="Enter item name"
                required
                className="bg-zinc-800 placeholder:text-zinc-600"

              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="description">Description</label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="Optional item description"
                rows={3}
                className="bg-zinc-800 placeholder:text-zinc-600"

              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="amount">Amount *</label>
                <Input
                id="amount"
                type="number"
                min="1"
                value={formData.amount === 0 ? "" : formData.amount} // show empty if 0
                onChange={(e) => {
                    const val = e.target.value
                    updateField("amount", val === "" ? 0 : parseInt(val, 10))
                }}
                placeholder="100"
                required
                className="bg-zinc-800 placeholder:text-zinc-600"
                />

              </div>

              <div className="grid gap-2">
                <label htmlFor="currency">Currency *</label>
                <Select
                  value={formData.currency}
                  onValueChange={(value: "coins" | "points") => updateField("currency", value)}

                >
                  <SelectTrigger
                    className="bg-zinc-800 placeholder:text-zinc-600"
                  
                  >
                    <SelectValue placeholder="Select currency" 
                    
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="coins">Coins</SelectItem>
                    <SelectItem value="points">Points</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="type">Type *</label>
                {/* <Input
                  id="type"
                  value={formData.type}
                  onChange={(e) => updateField("type", e.target.value)}
                  placeholder="title, energy, potion"
                  required
                className="bg-zinc-800 placeholder:text-zinc-600"

                /> */}
                <Select
                  value={formData.type}
                onValueChange={(value: string) => updateField("type", value)}
                >
                  <SelectTrigger
                    className="bg-zinc-800 placeholder:text-zinc-600"
                  
                  >
                    <SelectValue placeholder="Select option" className=" placeholder:text-white capitalize" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="title">Title</SelectItem>
                    <SelectItem value="skin">Skin</SelectItem>
                    <SelectItem value="hair">Hair</SelectItem>
                    <SelectItem value="weapon">Weapon</SelectItem>
                    <SelectItem value="energy">Energy</SelectItem>
                    <SelectItem value="potion">Potion</SelectItem>
                  </SelectContent>
                </Select>
              </div>

                <div className="grid gap-2">
                    <label htmlFor="amount">Consumable</label>
                    <Input
                    id="amount"
                    type="number"
                    min={0}
                    value={formData.consumable}
                    onChange={(e) => {
                        const val = e.target.value
                        updateField('consumable', val)
                    }}
                    placeholder="100"
                    required
                    className="bg-zinc-800 placeholder:text-zinc-600"
                    />

                </div>

              {/* <div className="grid gap-2">
                <label htmlFor="consumable">Consumable</label>
                <Select
                  value={formData.consumable}
                  onValueChange={(value: "1" | "0") => updateField("consumable", value)}
                >
                  <SelectTrigger
                    className="bg-zinc-800 placeholder:text-zinc-600"
                  
                  >
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">No</SelectItem>
                    <SelectItem value="1">Yes</SelectItem>
                  </SelectContent>
                </Select>
              </div> */}
            </div>
          </div>

          <DialogFooter className=" mt-6">
            {/* <Button type="button" variant="outline" onClick={() => setOpen(false)} className=" text-black">
              Cancel
            </Button> */}
            <Button type="submit" disabled={loading}>
                {loading && <Loader2 size={16} className="animate-spin mr-2" />}
                Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
