'use client'

import { config } from "@/wagmi/config";
import { useAccount, useBalance, useEnsAvatar, useEnsName } from 'wagmi'
import { normalize } from 'viem/ens'
import Activity from "./Activity";
import Leaderboard from "./Leaderboard";
import InventoryPreview from "./InventoryPreview";
import NewsPreview from "./NewsPreview";

export default function DashboardClient() {

  const { address, isConnected } = useAccount({ config });

    
   const { data: balance } = useBalance({
    address: address,
  });

  // Disable ENS for now - it can be very slow
  const { data: ensName } = useEnsName({
    address: address,
    query: {
      enabled: false, // Disable ENS lookups as they're slow
    }
  })

  const ensAvatar = useEnsAvatar({
    name: normalize('wevm.eth'),    
    config: config,
    query: {
      enabled: false, // Disable avatar lookups
    }
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
                <Activity />
                {/* Leaderboard */}
                <Leaderboard/>
            </div>

            {/* Inventory 1/4 of the width */}
            <div className=" flex flex-col w-2/5 ml-6">
                <InventoryPreview />
                <NewsPreview />
            </div>
        </div>
    
    </div>
    )
}
