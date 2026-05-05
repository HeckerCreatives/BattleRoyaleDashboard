"use client"

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react'

import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { useGetRewardItems, VALID_REWARD_TYPES } from '@/api/rewards/quest'
import { useGetUser, useGrantUser } from '@/api/grant/grant'
import { GrantSchema, grantSchema } from '@/validations/grant'
import toast from 'react-hot-toast'

export default function Page() {
  const { data: rewardItems } = useGetRewardItems()
  const { mutate: grantUser, isPending } = useGrantUser()

  const [search, setSearch] = useState('')
  const [popoverOpen, setPopoverOpen] = useState(false)
  const [selectedUsername, setSelectedUsername] = useState('')

  const { data: users, isLoading: isLoadingUsers } = useGetUser(search)
  const [resetKey, setResetKey] = useState(0)

  const {
    register,
    watch,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<GrantSchema>({
    resolver: zodResolver(grantSchema),
    defaultValues: { amount: 1 },
  })

  const handleGrant = (data: GrantSchema) => {
    grantUser({userid: data.userid, rewards: [data]}, {
      onSuccess: () => {
        toast.success(`Successfully granted ${watch('type')}`)
        reset()
          setSelectedUsername('')
          setSearch('')
          setResetKey((k) => k + 1) 
      },
    })
  }

  const selectedType = watch('type')

  useEffect(() => {
    setValue('amount', 1)
  },[selectedType])

  return (
    <div className="flex w-full h-screen md:h-screen">
      <div className="flex flex-col gap-8 w-full p-4 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            className="flex flex-col gap-5 items-center justify-center w-full h-auto rounded-lg p-4 border border-orange-300/30"
            style={{
              backgroundImage: "url('/userdashboard/Assets/TAB HOLDER small.png')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            <p className="text-sm font-semibold">Grant</p>

            <form key={resetKey} onSubmit={handleSubmit(handleGrant)} className="flex flex-col gap-2 items-start w-full">

              {/* ── Player Selector ── */}
              <div className="space-y-1 w-full">
                <p className="text-xs text-zinc-500">Player</p>
                <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full justify-between bg-zinc-800 border-none text-left font-normal text-zinc-300 hover:bg-zinc-700"
                    >
                      {selectedUsername || <span className="text-zinc-500">Search player...</span>}
                      <ChevronsUpDown size={14} className="text-zinc-500 shrink-0" />
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent
                    className="w-full p-0 bg-zinc-800 border-zinc-700"
                    align="start"
                  >
                    {/* Search */}
                    <div className="p-2 border-b border-zinc-700">
                      <Input
                        placeholder="Search username..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="bg-zinc-700 border-none text-sm h-8 text-white placeholder:text-zinc-400"
                        autoFocus
                      />
                    </div>

                    {/* Results */}
                    <div className="max-h-48 overflow-y-auto">
                      {isLoadingUsers ? (
                        <div className="flex items-center justify-center gap-2 py-4 text-zinc-400 text-xs">
                          <Loader2 size={14} className="animate-spin" />
                          Searching...
                        </div>
                      ) : users?.data?.userlist?.length === 0 ? (
                        <p className="text-center text-zinc-500 text-xs py-4">No players found.</p>
                      ) : (
                        users?.data?.userlist?.map((user) => (
                          <button
                            key={user.id}
                            type="button"
                            onClick={() => {
                              setValue('userid', user.id)
                              setSelectedUsername(user.username)
                              setPopoverOpen(false)
                              setSearch('')
                            }}
                            className="w-full flex items-center justify-between px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-700 transition-colors"
                          >
                            <div className="flex flex-col items-start">
                              <span>{user.username}</span>
                            </div>
                            {watch('userid') === user.id && (
                              <Check size={14} className="text-green-400 shrink-0" />
                            )}
                          </button>
                        ))
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
                {errors.userid && <p className="text-red-400 text-xs">{errors.userid.message}</p>}
              </div>

              {/* ── Type ── */}
              <div className="space-y-1 w-full">
                <p className="text-xs text-zinc-500">Type</p>
                <Select
                  value={watch('type')}
                  onValueChange={(value) => {
                    setValue('type', value)
                    setValue('itemid', '')
                  }}
                >
                  <SelectTrigger className="w-full bg-zinc-800 border-none">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {VALID_REWARD_TYPES.map((t) => (
                      <SelectItem key={t} value={t} className="capitalize">
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.type && <p className="text-red-400 text-xs">{errors.type.message}</p>}
              </div>

              {/* ── Item (conditional) ── */}
              {['energy', 'potion', 'title', 'item'].includes(selectedType) && (
                <div className="space-y-1 w-full">
                  <p className="text-xs text-zinc-500">Item</p>
                  <Select
                    value={watch('itemid')}
                    onValueChange={(value) => setValue('itemid', value)}
                  >
                    <SelectTrigger className="w-full bg-zinc-800 border-none">
                      <SelectValue placeholder="Select item" />
                    </SelectTrigger>
                    <SelectContent
                      position="popper"
                      sideOffset={4}
                      className="z-[9999]"
                    >
                      {rewardItems?.data
                        .filter((item) => item.type === selectedType)
                        .map((item) => (
                          <SelectItem key={item.itemid} value={item.itemid} className="capitalize">
                            {item.itemname}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  {errors.itemid && <p className="text-red-400 text-xs">{errors.itemid.message}</p>}
                </div>
              )}

              {/* ── Amount ── */}
              <div className="space-y-1 w-full">
                <p className="text-xs text-zinc-500">Amount</p>
                <Input
                  placeholder="Amount"
                  type="number"
                  disabled={selectedType === 'title'}
                  min={1}
                  className="bg-zinc-800 border-none"
                  {...register('amount', { valueAsNumber: true })}
                />
                {errors.amount && <p className="text-red-400 text-xs">{errors.amount.message}</p>}
              </div>

              <Button className="w-full mt-4 relative z-0" type="submit" disabled={isPending}>
                {isPending ? <Loader2 size={14} className="animate-spin mr-2" /> : null}
                Grant
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}