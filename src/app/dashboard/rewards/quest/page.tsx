"use client"

import React, { useState } from 'react'
import { FaSpinner, FaTasks } from 'react-icons/fa'
import { Badge } from '@/components/ui/badge'
import { useGetQuests } from '@/api/rewards/quest'
import { CreateQuestForm } from './form'
import { EditQuestForm } from './edit'
import { DeleteQuestForm } from './delete'

export default function QuestPage() {
  const { data, isLoading, isError } = useGetQuests()

  return (
    <div className="flex flex-col w-full min-h-screen md:p-8 p-4 gap-6 bg-zinc-950">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-zinc-800 p-2 rounded-lg">
            <FaTasks size={18} className="text-zinc-300" />
          </div>
          <div>
            <h1 className="text-white text-xl font-semibold">Quests</h1>
            <p className="text-zinc-500 text-xs mt-0.5">Manage all game quests and their rewards</p>
          </div>
        </div>
        {/* <CreateQuestForm /> */}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-24">
          <FaSpinner size={22} className="animate-spin text-zinc-500" />
        </div>
      )}

      {/* Empty */}
      {!isLoading && data?.data.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <FaTasks size={32} className="text-zinc-700" />
          <p className="text-zinc-500 text-sm">No quests found</p>
        </div>
      )}

      {/* Grid */}
      {!isLoading && (data?.data?.length ?? 0) > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {data?.data.map((item) => (
            <div
              key={item._id}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col gap-4 hover:border-zinc-600 transition-colors"
            >
              {/* Card Header */}
              <div className="flex items-start flex-wrap justify-between gap-2">
                <div className="flex flex-col gap-1 flex-1 max-w-[12rem]">
                  <span className="text-white font-medium text-sm">{item.title}</span>
                  <span className="text-zinc-500 text-xs truncate">{item.questid}</span>
                </div>
                <Badge
                  className={`text-xs shrink-0 ${
                    item.isActive
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                  }`}
                  variant="outline"
                >
                  {item.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>

              {/* Description */}
              {item.description && (
                <p className="text-zinc-400 text-xs leading-relaxed line-clamp-2">
                  {item.description}
                </p>
              )}

              {/* Meta Pills */}
              <div className="flex flex-wrap gap-2">
                <span className="bg-zinc-800 text-zinc-300 text-xs px-2.5 py-1 rounded-full">
                  {item.type}
                </span>
                <span className="bg-zinc-800 text-zinc-300 text-xs px-2.5 py-1 rounded-full">
                  Target: {item.target}
                </span>
                {item.isSkippable && (
                  <span className="bg-zinc-800 text-zinc-400 text-xs px-2.5 py-1 rounded-full">
                    Skippable
                  </span>
                )}
              </div>

              {/* Rewards */}
              {item.rewards?.length > 0 && (
                <div className="flex flex-col gap-1.5">
                  <span className="text-zinc-500 text-xs">Rewards</span>
                  <div className="flex flex-wrap gap-1.5">
                    {item.rewards.map((reward, i) => (
                      <span
                        key={i}
                        className="bg-orange-500/10 capitalize text-orange-400 border border-orange-500/20 text-xs px-2 py-0.5 rounded-ful flex gap-2"
                      >
                        {reward.type}:
                        {['energy', 'potion', 'title', 'item'].includes(reward.type) ? (
                           <>
                          {reward.itemid}

                          </>
                        ): (
                          <>
                        {reward.amount}

                          </>

                        )}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Divider + Actions */}
              <div className="border-t border-zinc-800 pt-3 flex justify-end gap-2">
                <EditQuestForm quest={item} />
                {/* <DeleteQuestForm quest={item} /> */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}