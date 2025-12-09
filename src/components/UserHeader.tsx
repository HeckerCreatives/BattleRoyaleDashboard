"use client"
import React, { ChangeEvent, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import Link from 'next/link'
import { IoLogOut } from "react-icons/io5";
import { RiMenu2Line } from "react-icons/ri";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { FaUsers, FaBullhorn, FaEdit } from 'react-icons/fa';
import { GrTransaction, GrHostMaintenance } from 'react-icons/gr';
import { IoIosArrowDown, IoIosGift, IoIosMail, IoIosSettings } from 'react-icons/io';
import { MdDashboard, MdAdminPanelSettings, MdWeb } from 'react-icons/md';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie'

import { config } from "@/wagmi/config";
import { useAccount, useBalance, useConnect, useDisconnect, useEnsAvatar, useEnsName, useSwitchAccount } from 'wagmi'
import { normalize } from 'viem/ens'
import Image from 'next/image'
import { useCheckSession } from '@/app/api/auth/auth'




export default function UserHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const disconnect = useDisconnect();
  const [selectedImage, setSelectedImage] = useState<string | ArrayBuffer | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const { data, isPending } = useCheckSession();

    const ensAvatar = useEnsAvatar({
      name: normalize('wevm.eth'),    
      config: config
    })
  
   const handleLogout = () => {
    disconnect.disconnect();
    Cookies.remove('sessionToken'); 
    router.push('/auth/user');
  };

  return (
     <div className=' sticky top-0 z-30 flex items-center justify-between px-4 w-full h-[80px] bg-zinc-950'
     style={{backgroundImage: "url('/dashboard/assets/Top Rectangular.png')", backgroundSize: "cover", backgroundPosition: "left", backgroundRepeat:"no-repeat"}}
     
     >
      <div className=' flex items-center gap-4'>
         
         <Sheet  key={'left'}>
        <SheetTrigger className=' block lg:hidden'>
          <RiMenu2Line size={20}/>
        </SheetTrigger>
        <SheetContent key={'left'} className=' bg-zinc-950 border-zinc-900'
         style={{backgroundImage: "url('/dashboard/assets/Left Rectangular.png')", backgroundSize: "cover", backgroundPosition: "right", backgroundRepeat:"no-repeat"}}
        >
          <div className=' flex flex-col gap-5 w-full h-full p-4 text-white'>
            <Link href='/dashboard/' aria-label='Go to the dashboard' passHref>
                <div className='flex items-center justify-center space-x-3'>
                <img src="/logo 06 B.png" alt="" width={120} />
                
                </div>
            </Link>
            <div className=' flex flex-col gap-5 w-full h-full p-4'>
        {/* <Link href='/dashboard' aria-label='Go to the dashboard' passHref>
            <div className='flex items-center justify-center space-x-3'>
            <img src="/logo 06 B.png" alt="" width={120} />
            </div>
        </Link> */}

        <div className=' flex flex-col gap-4=2'>
            <Link
            href='/dashboard'
            className={`flex items-center space-x-4 px-3 py-2 text-sm hover:text-secondary ease-in-out duration-300 ${pathname === '/dashboard/' && ' text-secondary'}`}
            passHref
          >
            <MdDashboard size={20}/>
            <span>Dashboard</span>
          </Link>


           <Link
            href='/user/rewards'
            className={`flex items-center space-x-4 px-3 py-2 text-sm hover:text-secondary ease-in-out duration-300 ${pathname === '/user/rewards/' && ' text-secondary'}`}
            role='menuitem'
            passHref
          >
            <IoIosGift size={20}/>
            <span>Rewards</span>
          </Link>

           <Link
            href='/user/settings'
            className={`flex items-center space-x-4 px-3 py-2 text-sm hover:text-secondary ease-in-out duration-300 ${pathname === '/user/settings/' && ' text-secondary'}`}
            role='menuitem'
            passHref
          >
            <IoIosSettings size={20}/>
            <span>Account Settings</span>
          </Link>
        </div>

    </div>

        </div>
        </SheetContent>
      </Sheet>

        { pathname === '/user/dashboard/' && (
          <a href='/user/dashboard' className=' text-xs md:text-lg text-white'>Dashboard</a>
        )}

        { pathname === '/user/marketplace/' && (
          <a href='/user/marketplace' className=' text-xs md:text-lg text-white'>Marketplace</a>
        )}

          { pathname === '/user/inventory/' && (
          <a href='/user/inventory' className=' text-xs md:text-lg text-white'>Inventory</a>
        )}

        { pathname === '/user/minting/' && (
          <a href='/user/minting' className=' text-xs md:text-lg text-white'>Minting</a>
        )}



      </div>
    
        <Popover>
          <PopoverTrigger>
             <div className='flex items-start gap-2'>
              <div className=' flex flex-col items-end'>
                <p className=' text-xs font-semibold'>{data?.data?.username}!</p>
                <p className=' text-xs text-zinc-500'>{(data?.data?.walletAddress?.slice(0, 8) || "") + '...' + (data?.data?.walletAddress?.slice(-4) || "")}</p>

              </div>
               <img src="/logo 06 B.png" alt="" width={60} height={60} className=' w-[50px] md:w-[60px]' />

            </div>
          </PopoverTrigger>
          <PopoverContent className=' flex flex-col gap-4 w-auto p-6 bg-zinc-950 border-zinc-900 text-white mt-4'>

           
            <p onClick={handleLogout} className=' cursor-pointer text-sm flex items-center gap-2 hover:text-secondary ease-in-out duration-300'><IoLogOut size={20}/>Log Out</p>
          </PopoverContent>
        </Popover>

    </div>
  )
}
