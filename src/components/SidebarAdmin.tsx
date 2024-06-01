import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FaUsers } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { MdAdminPanelSettings } from "react-icons/md";
import { GrHostMaintenance } from "react-icons/gr";
import { GrTransaction } from "react-icons/gr";
import { FaBullhorn } from "react-icons/fa";
import { IoIosGift } from "react-icons/io";
import { IoIosSettings } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"


export default function SidebarAdmin() {
    const pathname = usePathname()

  return (
   <nav className=' lg:block hidden w-[300px] h-screen sticky left-0 top-0 bg-zinc-950 text-white '>
    <div className=' flex flex-col gap-5 w-full h-full p-4'>
        <Link href='/dashboard' aria-label='Go to the dashboard' passHref>
            <div className='flex items-center justify-center space-x-3'>
            <img src="/logo 06 B.png" alt="" width={120} />
            </div>
        </Link>

        <p>Admin</p>

        <div className=' flex flex-col gap-4=2'>
            <Link
            href='/admin'
            className={`flex items-center space-x-4 px-3 py-2 text-sm hover:text-secondary ease-in-out duration-300 ${pathname === '/dashboard' && ' text-secondary'}`}
            passHref
          >
            <MdDashboard size={20}/>
            <span>Dashboard</span>
          </Link>

        </div>

    </div>

   </nav>
  )
}
