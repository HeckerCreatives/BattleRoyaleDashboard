'use client'

import { useAccount, useBalance, useConnect, useEnsAvatar, useEnsName, useSwitchAccount, useSwitchChain, useChains, useChainId, useDisconnect } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { FaEthereum } from "react-icons/fa";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { normalize } from 'viem/ens'
import { config } from "@/wagmi/config";
import { LinkWallet } from '@/components/auth/LinkWallet';
import toast from 'react-hot-toast';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import Image from 'next/image';
import { useCheckSession } from '@/app/api/auth/auth';
import { Button } from '@/components/ui/button';

export default function ProfilePage() {
    const [network, setNetwork] = useState<String>("");
    const { data, isPending } = useCheckSession();
    const { disconnect } = useDisconnect();

    const { connect } = useConnect()
    const { chains, switchChain } = useSwitchChain()
    const allchains = useChains()
    const chainId = useChainId()

    const { address, isConnected } = useAccount();
    
    // Validate wallet matches session
    useEffect(() => {
        if (!isPending && data) {
            const sessionWallet = data.data?.walletAddress;
            
            // If both connected and session wallet exists, check if they match
            if (isConnected && sessionWallet && address) {
                const addressesMatch = sessionWallet.toLowerCase() === address.toLowerCase();
                
                if (!addressesMatch) {
                    disconnect();
                    toast.error('Connected wallet does not match your account wallet');
                }
            }
        }
    }, [data, isPending, isConnected, disconnect, address]);

    useEffect(() => {
        // get chain name from chainId
        const currentChain = allchains.find((ch) => ch.id === chainId)
        if (currentChain) {
            setNetwork(currentChain.name)
        }
        
    }, [allchains, chainId])
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
  



  useEffect(() => {
    if (isConnected) {
      console.log('Connected with address:', address);
    }

    if (balance) {
      console.log('Balance:', balance);
    }
  }, [isConnected, address]);

  const formatAddress = (address: string) => {
    return address ? `${address.slice(0, 12)}...${address.slice(-4)}` : ''
  }

    return (
      <div className=' h-screen w-full flex items-center justify-center'>
        <div className=' relative border-orange-400/50 border-2 w-[95%] min-h-[500px] md:w-[700px] xl:w-[800px] bg-red-900 rounded-md'
     style={{backgroundImage: "url('/login/Login Tab.png')", backgroundSize: "cover", backgroundPosition: "bottom", backgroundRepeat:"no-repeat"}}
        
        >
            <div className=' w-full flex flex-col items-start gap-4 mt-4 p-8'>
                <h1>Account Settings</h1>

                <Tabs defaultValue="profile" className=" w-full">
                    <TabsList className=" bg-zinc-800 rounded-md mb-4">
                        <TabsTrigger value="profile" className=" data-[state=active]:bg-orange-400 data-[state=active]:text-amber-950 w-1/2">Profile</TabsTrigger>
                        <TabsTrigger value="wallet" className=" data-[state=active]:bg-orange-400 data-[state=active]:text-amber-950 w-1/2">Wallet</TabsTrigger>
                    </TabsList>
                    <TabsContent value="profile">
                        <div className='flex flex-col'>
                            <div className=''>
                                <p className=' text-sm text-zinc-400 mb-2'>Username</p>
                                <input type="text" placeholder={data?.data.username || 'Username123'} className=' w-full md:w-1/2 bg-zinc-950 text-white border border-zinc-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400'/>
                            </div>
                            <div className=' mt-4'>
                                <p className=' text-sm text-zinc-400 mb-2'>Email</p>
                                <input type="email" placeholder={data?.data.email || 'email@example.com'} className=' w-full md:w-1/2 bg-zinc-950 text-white border border-zinc-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400'/>
                            </div>
                            <div className='flex flex-col gap-y-2'>
                                <p className='text-sm text-zinc-400 mt-4'>Change Password</p>
                                <input type="password" placeholder="Old" className=' w-full md:w-1/2 bg-zinc-950 text-white border border-zinc-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400'/>
                                <input type="password" placeholder="New" className=' w-full md:w-1/2 bg-zinc-950 text-white border border-zinc-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400'/>
                                <input type="password" placeholder="Repeat New" className=' w-full md:w-1/2 bg-zinc-950 text-white border border-zinc-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400'/>                                
                            <Button className=' mt-4 bg-orange-400 text-amber-950 hover:bg-orange-500 w-full md:w-1/2'>
                                Change
                            </Button>
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="wallet" className='w-full'>
                        <div className='space-y-4 w-full'>
                            {/* Profile Header */}
                            <div className="flex items-center gap-4 py-4">
                                <div className="w-[100px] h-[100px] rounded-full overflow-hidden bg-zinc-800">
                                    <Image
                                    src={ensAvatar.data || "/metamask.png"}
                                    width={100}
                                    height={100}
                                    alt="avatar"
                                    className="object-cover"
                                    unoptimized={!!ensAvatar}
                                    />
                                </div>
                            <div className="flex flex-col gap-2">
                                <h2 className="text-white text-xl font-medium">
                                {data?.data.username || "Username123"}
                                </h2>
                                {isConnected && (
                                    <p className="text-zinc-400 text-sm flex gap-2">
                                    {formatAddress(address || '')}
                                </p>
                                )}
                            </div>
                            </div>


                                {/* display chains and add swich network */}
                                <div className="flex w-full items-center ">
                                    <p className="text-zinc-400 text-sm font-bold ">Networks: </p>
                                    <div className="flex items-center gap-2">
                                    {chains.map((ch) => (
                                        <button
                                        key={ch.id}
                                        onClick={() => switchChain({ chainId: ch?.id })}
                                        className=" h-[40px] w-full  flex justify-center items-center gap-2 text-white text-sm font-medium  px-2 py-1 rounded-md"
                                        >
                                        {ch.name}
                                        </button>
                                    ))}
                                    </div>
                                </div>
                                    <div className='w-full h-[3px] mb-4 bg-zinc-600/60 '></div>
                            {/* Wallet Details */}
                            {isConnected ? (
                                <>
                            <div className="grid grid-cols-2 gap-4 w-full">
                                    <div className="space-y-2 w-full">
                                        <p className="text-zinc-400 text-sm">Account Balance</p>
                                        <p className="text-white text-lg font-medium flex items-center gap-1">
                                            <FaEthereum />
                                            {balance?.formatted || '0'} {balance?.symbol}
                                        </p>
                                    </div>
                                <div className="space-y-2">
                                    <p className="text-zinc-400 text-sm">USD Value</p>
                                    <p className="text-white text-lg font-medium">
                                        ${balance?.formatted ? (Number(balance.formatted) * 3000).toFixed(2) : '0.00'}
                                    </p>
                                </div>
                            </div>
                        <div className='w-full h-[3px] mb-4 bg-zinc-600/60 '></div>
                            <div className="grid grid-cols-2 gap-4 w-full">
                                <div className="space-y-2">
                                    <p className="text-zinc-400 text-sm">Network</p>
                                    <p className="text-white text-lg font-medium">{network ?? 'Unknown'}</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-zinc-400 text-sm">Status</p>
                                    <p className="text-emerald-400 text-lg font-medium flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-emerald-400"/>
                                        Connected
                                    </p>
                                </div>
                            </div>
                                </>
                            ) : (
                                <div className="text-center py-4">
                                <p className="text-zinc-400">Connect your wallet to link it to your account</p>
                                <div className="mt-4 max-w-sm mx-auto">
                                <LinkWallet 
                                    onSuccess={() => console.log('Wallet linked successfully')}
                                    onError={(error) => console.error('Link failed:', error)}
                                />
                                </div>
                            </div>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
          <img src="/login/Login Tab Character.png" width={300} alt="" className=' translate-x-4 absolute bottom-0 right-0 md:block hidden'/>
    
        </div>
      </div>
        
     
    )
}