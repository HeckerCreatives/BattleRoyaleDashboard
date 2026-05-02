'use client'
import { Button } from '@/components/ui/button'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { PartyPopper, Trophy } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useGetLeaderboardHistory } from '@/api/leaderboard/list'
import Loader from '@/components/Loader'
import Pagination from '@/components/pagination'
import { FaSpinner } from 'react-icons/fa'

const tabs = [
    {id: 'points', name:'ROF Points'},
    {id: 'kills', name:'Kills'},
    {id: 'deaths', name:'Deaths'},
    {id: 'levels', name:'Level'},
    {id: 'wins', name:'Wins'},
    {id: 'playtime', name:'Play Time'},
    {id: 'matches', name:'Matches'},

    // {name:'Rank'},
    // {name:'Event'},
]

export default function Leaderboard() {
  const [controls, setControls] = useState({page: 0, limit: 5, totalPages: 0})
  const [tab, setTab] = useState('points')
  const {data, isPending, isLoading} = useGetLeaderboardHistory(controls.page, controls.limit, tab.replace(/\s+/g, ""))

  const rankStyle = (data: number) => {
    if(data === 1){
      return ' border-yellow-400'
    } else if(data === 2){
      return ' border-zinc-300'
    } else if(data === 3){
      return ' border-amber-500'
    }
  }

  useEffect(() => {
    setControls((prev) => ({
      ...prev,
      totalPages: data?.data.pagination.totalPages ?? 0
    }))
  },[data])

  useEffect(() => {
    setControls((prev) => ({
      ...prev,
      page: 0
    }))
  } , [tab])

  function formatPlaytime(minutes: number) {
  const hrs = Math.floor(minutes / 60)
  const mins = minutes % 60

    return `${hrs}:${mins.toString().padStart(2, "0")}`
  }

  return (
    <div className=' p-8'>
        <div className='relative w-full h-fit bg-zinc-950 border-2 border-orange-300/50 rounded-lg p-4 space-y-6'>
      <Image src={'/auth/auth_tab.png'} alt='bg' width={400} height={400} className=' absolute -z-10 inset-0 object-right h-full w-full opacity-20' loading='lazy'/>
      <p className=' text-lg font-semibold px-6 py-2 bg-linear-to-r from-amber-900/70 to-amber-900/0'>Leaderboard</p>
      <div className=' flex items-center gap-2 overflow-x-auto w-full custom-scroll py-2'>
        {tabs.map((item, index) => (
            <Button key={index} onClick={() => setTab(item.id.toLowerCase())} className={` w-32 h-7! ${tab === item.id.toLowerCase() ? 'gradient-bg' : ' bg-transparent border border-orange-200'}`}>{item.name}</Button>
        ))}
        
      </div>
      <div className=' flex flex-col gap-2'>

         <>
          <Table>
              

              {isPending ? (
                <TableCaption className=' '><FaSpinner size={20} className=' animate-spin text-white'/></TableCaption>
              ) : (
                <>
                {Object.values(data?.data.leaderboard || {}).length === 0 && (
              <TableCaption>No data found</TableCaption>
              )}
                </>
              )}
            <TableHeader>
              <TableRow>
                <TableHead className=" font-semibold text-orange-300">Rank</TableHead>
                <TableHead className=" font-semibold text-orange-300">Username</TableHead>
                <TableHead className=" font-semibold text-orange-300 capitalize">{tab}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.values(data?.data.leaderboard || {}).map((item, index) => (
                <TableRow key={index}>
                 <TableCell>{controls.page * controls.limit + index + 1}</TableCell>
                  <TableCell className="">{item.user}</TableCell>
                  <TableCell>
                    {tab === "playtime"
                      ? formatPlaytime(item.amount)
                      : item.amount.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
          
            </TableBody>
          </Table>

          {controls.totalPages !== 0 && (
            <div className=' w-full flex items-end justify-end'>
              <Pagination
              currentPage={controls.page}
              totalPages={controls.totalPages}
              onPageChange={(page) =>
                  setControls((prev) => ({
                  ...prev,
                  page,
                  }))
              }
              />
            </div>
          )}
          </>

       
      
      </div>


    </div>
    </div>
  )
}
