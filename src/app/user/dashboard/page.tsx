"use client"

import { config } from "@/wagmi/config";
import { useAccount, useBalance, useConnect, useEnsAvatar, useEnsName, useSwitchAccount } from 'wagmi'
import { normalize } from 'viem/ens'
import Image from 'next/image'

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import Activity from "./components/Activity";
import Leaderboard from "./components/Leaderboard";
import { useGetNFTActivityHistory } from "@/api/inventory/list";




export default function Dashboard() {

  const { address, isConnected } = useAccount({ config });
  const { data, isPending } = useGetNFTActivityHistory();


    
   const { data: balance } = useBalance({
    address: address,
  });

  const { data: ensName } = useEnsName({
    address: address,
  })

  const ensAvatar = useEnsAvatar({
    name: normalize('wevm.eth'),    
    config: config
  })


    return (
     <div className='w-full h-full p-4'>
        <div className="flex gap-4">
            <img src="/logo 06 B.png" alt="" width={60} height={60} className=' w-[50px] md:w-[60px]' />
            <div className=" flex flex-col">
                <p className=" text-lg font-semibold">Welcome, Username123456!</p>
                <p className=" text-sm text-zinc-400"> {ensName ? ensName : address?.slice(0, 8) + '...' + address?.slice(-4)}</p>
            </div>
        </div>

        <div className="flex w-full mt-6">
            {/* Activity and Leaderboard 3/4 of the width */}
            <div className="flex flex-col w-3/5 ">
                {/* Activity */}
                <Activity activityData={data?.data} isLoading={isPending} />
                {/* Leaderboard */}
                <Leaderboard/>
            </div>

            {/* Inventory 1/4 of the width */}
            <div className=" flex flex-col w-2/5 ml-6">
                <div className="border rounded-md h-[400px]">
                    <h2 className=" text-xl font-semibold mb-4 bg-orange-400 p-2 rounded-sm">Inventory</h2>
                </div>
                <div className="border rounded-md h-[300px] mt-8">
                    <h2 className=" text-xl font-semibold mb-4 bg-orange-400 p-2 rounded-sm">News</h2>
                </div>
            </div>
        </div>
    
    </div>
    )
}