"use client"

import { Button } from '@/components/ui/button'
import { Play, RefreshCcw } from 'lucide-react'
import React from 'react'
import { FaTasks } from 'react-icons/fa'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import toast from 'react-hot-toast'
import axiosInstance from '@/utils/AxiosInstance'
import { resetQuest, resetWatchAds } from '@/api/dailies/reset'


const resetPlayerAds = () =>
  axiosInstance.post('/quest/resetallwatchads')

const resetAllQuestProgress = () =>
  axiosInstance.post('/quest/resetallquestprogress')


interface ResetCardProps {
  icon: React.ReactNode
  title: string
  description: string
  onReset: () => void
  isPending: boolean
}

function ResetCard({ icon, title, description, onReset, isPending }: ResetCardProps) {
  return (
    <div className="w-full space-y-4 flex flex-col items-start justify-between h-full bg-zinc-900 border border-zinc-700 rounded-lg p-6">
      <div className="flex items-center gap-2">
        {icon}
        <p>{title}</p>
      </div>
      <p className="text-xs text-zinc-500">{description}</p>
      <Button className="w-full gap-2" onClick={onReset} disabled={isPending}>
        <RefreshCcw size={15} className={isPending ? 'animate-spin' : ''} />
        {isPending ? 'Resetting...' : 'Reset'}
      </Button>
    </div>
  )
}


const RESET_CARDS = [
  {
    key: 'ads',
    icon: <Play size={20} />,
    title: 'Watch Ads',
    description:
      'Clears all recorded ad view progress and resets each ad unit to its initial unwatched state.',
  },
  {
    key: 'quest',
    icon: <FaTasks size={20} />,
    title: 'Quest',
    description:
      'Resets all active and completed quest progress, returning every quest to its original uncompleted state.',
  },
]

export default function Page() {
  const adsMutation = useMutation({
    mutationFn: resetWatchAds,
    onSuccess: () => toast.success('Watch Ads has been reset successfully.'),
    onError: () => toast.error('Failed to reset watch ads. Please try again.')
  })

  const questMutation = useMutation({
    mutationFn: resetQuest,
    onSuccess: () => toast.success('Quest progress has been reset successfully.'),
    onError: () => toast.error('Failed to reset quest progress. Please try again.'),
  })

  const mutations: Record<string, typeof adsMutation> = {
    ads: adsMutation,
    quest: questMutation,
  }

  return (
    <div className="flex w-full h-screen p-8">
      <div className="w-full h-fit grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {RESET_CARDS.map(({ key, icon, title, description }) => (
          <ResetCard
            key={key}
            icon={icon}
            title={title}
            description={description}
            onReset={() => mutations[key].mutate()}
            isPending={mutations[key].isPending}
          />
        ))}
      </div>
    </div>
  )
}