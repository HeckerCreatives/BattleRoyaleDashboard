"use client"

import React, { useEffect, useState } from 'react'
import { ChevronsUpDown, Plus, RefreshCcw, Trash } from 'lucide-react'
import { FaTasks } from 'react-icons/fa'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { questSchema, QuestSchema } from '@/validations/quest'
import { DialogTrigger } from '@radix-ui/react-dialog'
import { Quest, useCreateQuest, useDeleteQuest, VALID_QUEST_TYPES, VALID_REWARD_TYPES } from '@/api/rewards/quest'
import toast from 'react-hot-toast'
import { id } from 'ethers'



export function DeleteQuestForm({quest}: {quest:Quest}) {
    const [open, setOpen] = useState(false)
    const {mutate: deleteQuest, isPending} = useDeleteQuest()



  const handleDelete = async () => {
    deleteQuest({id: quest._id, questid: quest.questid},{
        onSuccess: () => {
            toast.success('New quest added.')
            setOpen(false)
        }
    })
  }



  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
           <Button variant={'destructive'}  className="gap-2 ">
          <Trash size={16} />
        
        </Button>
        </DialogTrigger>
      <DialogContent className="bg-zinc-900 border border-zinc-700 text-white max-w-lg max-h-[90%] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <FaTasks size={16} />
          Delete Quest
          </DialogTitle>
        </DialogHeader>

     <DialogFooter className="gap-2 pt-2">
            <DialogClose asChild>
              <Button type="button" variant="ghost" className="text-zinc-400 hover:text-white">
                Cancel
              </Button>
            </DialogClose>
            <Button onClick={handleDelete} type="button" variant={'destructive'} disabled={isPending} className="gap-2">
              {isPending && <RefreshCcw size={14} className="animate-spin" />}
              Delete 
            </Button>
          </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}