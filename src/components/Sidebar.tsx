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
import { FaMessage } from "react-icons/fa6";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"


export default function Sidebar() {
    const pathname = usePathname()

  return (
   <nav className=' lg:block hidden w-[300px] h-screen sticky left-0 top-0 bg-zinc-950 text-white '>
    <div className=' flex flex-col gap-5 w-full h-full p-4'>
        <Link href='/dashboard' aria-label='Go to the dashboard' passHref>
            <div className='flex items-center justify-center space-x-3'>
            <img src="/logo 06 B.png" alt="" width={120} />
            </div>
        </Link>

        <div className=' flex flex-col gap-4=2'>
            <Link
            href='/dashboard'
            className={`flex items-center space-x-4 px-3 py-2 text-sm hover:text-secondary ease-in-out duration-300 ${pathname === '/dashboard' && ' text-secondary'}`}
            passHref
          >
            <MdDashboard size={20}/>
            <span>Dashboard</span>
          </Link>

          

          <Collapsible>
          <CollapsibleTrigger className=' flex items-center justify-between'>
          {/* <div className=' flex items-center gap-2'>

          </div> */}

           <p
              className={`flex items-center space-x-4 px-3 py-2 text-sm hover:text-secondary ease-in-out duration-300 ${pathname === '/dashboard/usermanagement/player/' && ' text-secondary'} ${pathname === '/dashboard/usermanagement/admins/' && ' text-secondary'}`}
              role='menuitem'
            >
              <FaUsers size={20}/>
              <span>User Management</span>
            </p>

            <IoIosArrowDown size={10}/>
           
          </CollapsibleTrigger>
          <CollapsibleContent className=' flex flex-col gap-2 pl-4'>
             <Link
              href='/dashboard/usermanagement/player'
              className={`flex items-center space-x-4 px-3 py-2 text-sm hover:text-secondary ease-in-out duration-300 ${pathname === '/dashboard/usermanagement/player/' && ' text-secondary'}`}
              passHref
            >
              <FaUsers size={20}/>
              <span>Players</span>
            </Link>

            {/* <Link
              href='/dashboard/usermanagement/admins'
              className={`flex items-center space-x-4 px-3 py-2 text-sm hover:text-secondary ease-in-out duration-300 ${pathname === '/dashboard/usermanagement/admins' && ' text-secondary'}`}
              passHref
            >
              <MdAdminPanelSettings size={20}/>
              <span>Admins</span>
            </Link> */}

            
          </CollapsibleContent>
        </Collapsible>

         <Link
              href='/dashboard/message'
              className={`flex items-center space-x-4 px-3 py-2 text-sm hover:text-secondary ease-in-out duration-300 ${pathname === '/dashboard/message/' && ' text-secondary'}`}
              passHref
            >
              <FaMessage size={20}/>
              <span>Message</span>
            </Link>


           <Link
            href='/dashboard/transaction'
            className={`flex items-center space-x-4 px-3 py-2 text-sm hover:text-secondary ease-in-out duration-300 ${pathname === '/dashboard/transaction/' && ' text-secondary'}`}
            role='menuitem'
            passHref
          >
            <GrTransaction size={20}/>
            <span>Transaction</span>
          </Link>

          <Link
            href='/dashboard/news'
            className={`flex items-center space-x-4 px-3 py-2 text-sm hover:text-secondary ease-in-out duration-300 ${pathname === '/dashboard/news/' && ' text-secondary'}`}
            role='menuitem'
            passHref
          >
            <FaBullhorn size={20}/>
            <span>News</span>
          </Link>


          <Link
            href='/dashboard/maintenance'
            className={`flex items-center space-x-4 px-3 py-2 text-sm hover:text-secondary ease-in-out duration-300 ${pathname === '/dashboard/maintenance/' && ' text-secondary'}`}
            role='menuitem'
            passHref
          >
            <GrHostMaintenance size={20}/>
            <span>Maintenance</span>
          </Link>

           <Link
            href='/dashboard/rewards'
            className={`flex items-center space-x-4 px-3 py-2 text-sm hover:text-secondary ease-in-out duration-300 ${pathname === '/dashboard/rewards/' && ' text-secondary'}`}
            role='menuitem'
            passHref
          >
            <IoIosGift size={20}/>
            <span>Rewards</span>
          </Link>

           <Link
            href='/dashboard/settings'
            className={`flex items-center space-x-4 px-3 py-2 text-sm hover:text-secondary ease-in-out duration-300 ${pathname === '/dashboard/settings/' && ' text-secondary'}`}
            role='menuitem'
            passHref
          >
            <IoIosSettings size={20}/>
            <span>Account Settings</span>
          </Link>
        </div>

    </div>

   </nav>
  )
}
