"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FaEdit, FaHammer, FaMobile, FaPowerOff, FaUsers } from "react-icons/fa";
import { MdDashboard, MdWeb } from "react-icons/md";
import { MdAdminPanelSettings } from "react-icons/md";
import { GrHostMaintenance } from "react-icons/gr";
import { GrTransaction } from "react-icons/gr";
import { FaBullhorn } from "react-icons/fa";
import { IoIosGift } from "react-icons/io";
import { IoIosSettings } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import { FaBagShopping, FaMessage, FaPerson, FaWebAwesome } from "react-icons/fa6";
import { IoIosMail } from "react-icons/io";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Box, MessageCircle, Phone, Store } from 'lucide-react';


export default function UserSidebar() {
    const pathname = usePathname()

  return (
   <nav className=' lg:block hidden w-[300px] h-screen sticky left-0 top-0 bg-zinc-950 text-white '
     style={{backgroundImage: "url('/dashboard/assets/Left Rectangular.png')", backgroundSize: "cover", backgroundPosition: "right", backgroundRepeat:"no-repeat"}}
   
   >
    <div className=' flex flex-col gap-5 w-full h-full p-4'>
        <Link href='/dashboard' aria-label='Go to the dashboard' passHref>
            <div className='flex items-center justify-center space-x-3'>
            <img src="/logo 06 B.png" alt="" width={120} />
            </div>
        </Link>

        <div className=' flex flex-col gap-4=2'>
            <Link
            href='/user/dashboard'
            className={`flex items-center space-x-4 px-3 py-2 text-sm hover:text-secondary ease-in-out duration-300 ${pathname === '/user/dashboard/' && ' text-secondary'}`}
            passHref
          >
            <MdDashboard size={20}/>
            <span>Dashboard</span>
          </Link>

          <Link
            href='/user/marketplace'
            className={`flex items-center space-x-4 px-3 py-2 text-sm hover:text-secondary ease-in-out duration-300 ${pathname === '/user/marketplace/' && ' text-secondary'}`}
            role='menuitem'
            passHref
          >
            <Store size={20}/>
            <span>Marketplace</span>
          </Link>

          <Link
              href='/user/inventory'
              className={`flex items-center space-x-4 px-3 py-2 text-sm hover:text-secondary ease-in-out duration-300 ${pathname === '/user/inventory/' && ' text-secondary'}`}
              passHref
            >
              <FaBagShopping size={20}/>
              <span>Inventory</span>
          </Link>

         <Link
              href='/user/minting'
              className={`flex items-center space-x-4 px-3 py-2 text-sm hover:text-secondary ease-in-out duration-300 ${pathname === '/user/minting/' && ' text-secondary'}`}
              passHref
            >
              <FaHammer size={20}/>
              <span>Minting</span>
          </Link>

         <Link
              href='/user/activate'
              className={`flex items-center space-x-4 px-3 py-2 text-sm hover:text-secondary ease-in-out duration-300 ${pathname === '/user/activate/' && ' text-secondary'}`}
              passHref
            >
              <FaPowerOff size={20}/>
              <span>Activate</span>
          </Link>

        <Link
              href='/user/profile'
              className={`flex items-center space-x-4 px-3 py-2 text-sm hover:text-secondary ease-in-out duration-300 ${pathname === '/user/profile/' && ' text-secondary'}`}
              passHref
            >
              <FaPerson size={20}/>
              <span>Profile</span>
          </Link>

        </div>

    </div>

   </nav>
  )
}
