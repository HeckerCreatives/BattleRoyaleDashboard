"use client"

import React, { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronsUpDown, Edit, Plus, RefreshCcw } from 'lucide-react'
import { FaTasks } from 'react-icons/fa'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { questSchema, QuestSchema } from '@/validations/quest'
import { DialogTrigger } from '@radix-ui/react-dialog'
import { Quest, useCreateQuest, useEditQuest, VALID_QUEST_TYPES, VALID_REWARD_TYPES } from '@/api/rewards/quest'
import toast from 'react-hot-toast'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Checkbox } from '@/components/ui/checkbox'
import { RewardsField } from './reaward-fields'


export function EditQuestForm({quest}: {quest:Quest}) {
    const [open, setOpen] = useState(false)
    const {mutate: editQuest, isPending} = useEditQuest()


  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<QuestSchema>({
    resolver: zodResolver(questSchema),
    defaultValues: ({
      isActive: quest.isActive,
      isSkippable: quest.isSkippable,
      type: quest.type,
      questid: quest.questid,
      id: quest._id,
      title: quest.title,
      description: quest.description,
      rewards: quest.rewards ,
      target: quest.target,
    })
  })

  const handleCreate = async (data:QuestSchema) => {
    editQuest(data,{
        onSuccess: () => {
            toast.success('Quest updated.')
            setOpen(false)
        }
    })
  }



  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            <Button  className="gap-2 bg-zinc-600">
          <Edit size={16} />
        
        </Button>
        </DialogTrigger>
      <DialogContent className="bg-zinc-900 border border-zinc-700 text-white max-w-xl max-h-[90%] w-[95%] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <FaTasks size={16} />
           Edit Quest'
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleCreate)} className="flex flex-col gap-4 py-2">

            <div className="flex flex-col gap-1.5">
            <Label className="text-zinc-400 text-xs">
              Quest id <span className="text-red-400">*</span>
            </Label>
            <Input
              {...register('questid')}
              placeholder="Quest title"
              className="bg-zinc-800 border-zinc-600 text-white placeholder:text-zinc-500"
            />
            {errors.questid && (
              <p className="text-red-400 text-xs">{errors.questid.message}</p>
            )}
          </div>

          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-zinc-400 text-xs">
              Title <span className="text-red-400">*</span>
            </Label>
            <Input
              {...register('title')}
              placeholder="Quest title"
              className="bg-zinc-800 border-zinc-600 text-white placeholder:text-zinc-500"
            />
            {errors.title && (
              <p className="text-red-400 text-xs">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-zinc-400 text-xs">
              Description <span className="text-red-400">*</span>
            </Label>
            <Textarea
              {...register('description')}
              placeholder="Quest description"
              className="bg-zinc-800 border-zinc-600 text-white placeholder:text-zinc-500 resize-none"
              rows={3}
            />
            {errors.description && (
              <p className="text-red-400 text-xs">{errors.description.message}</p>
            )}
          </div>

          {/* Type */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-zinc-400 text-xs">
              Type <span className="text-red-400">*</span>
            </Label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="bg-zinc-800 border-zinc-600 text-white">
                    <SelectValue placeholder="Select quest type" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                    {VALID_QUEST_TYPES.map((t) => (
                      <SelectItem key={t} value={t} className="focus:bg-zinc-700">
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.type && (
              <p className="text-red-400 text-xs">{errors.type.message}</p>
            )}
          </div>


           
          {/* Target & Rewards */}
          <div className="grid grid-cols-1 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-zinc-400 text-xs">Target</Label>
              <Input
                type="number"
                {...register('target', { valueAsNumber: true })}
                className="bg-zinc-800 border-zinc-600 text-white"
                min={0}
              />
              {errors.target && (
                <p className="text-red-400 text-xs">{errors.target.message}</p>
              )}
            </div>
          {/* Rewards Multi-Select */}
            <div className="flex flex-col gap-1.5">
                        <Label className="text-zinc-400 text-xs">Rewards <span className="text-red-400">*</span></Label>
                        <Controller
                          name="rewards"
                          control={control}
                          render={({ field }) => (
                            <RewardsField selected={field.value ?? []} onChange={field.onChange} />
                          )}
                        />
                        {errors.rewards && <p className="text-red-400 text-xs">{errors.rewards.message}</p>}
                      </div>

          </div>

          {/* Toggles */}
          <div className="flex gap-6">
            <Controller
              name="isSkippable"
              control={control}
              render={({ field }) => (
                <div className="flex items-center gap-2">
                  <Switch
                    id="skippable"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className='border border-zinc-500'
                  />
                  <Label htmlFor="skippable" className="text-zinc-400 text-xs cursor-pointer">
                    Skippable
                  </Label>
                </div>
              )}
            />
            <Controller
              name="isActive"
              control={control}
              render={({ field }) => (
                <div className="flex items-center gap-2">
                  <Switch
                    id="active"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className='border border-zinc-500'
                  />
                  <Label htmlFor="active" className="text-zinc-400  text-xs cursor-pointer">
                    Active
                  </Label>
                </div>
              )}
            />
          </div>

          <DialogFooter className="gap-2 pt-2">
            <DialogClose asChild>
              <Button type="button" variant="ghost" className="text-zinc-400 hover:text-white">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isPending} className="gap-2">
              {isPending && <RefreshCcw size={14} className="animate-spin" />}
              Save 
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}