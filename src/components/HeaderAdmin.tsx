import React from 'react'
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
import { FaUsers, FaBullhorn } from 'react-icons/fa';
import { GrTransaction, GrHostMaintenance } from 'react-icons/gr';
import { IoIosArrowDown, IoIosGift, IoIosSettings } from 'react-icons/io';
import { MdDashboard, MdAdminPanelSettings } from 'react-icons/md';


export default function HeaderAdmin() {
  const pathname = usePathname()
  return (
     <div className=' sticky top-0 flex items-center justify-between px-4 w-full h-[80px] bg-zinc-950'>
      <div className=' flex items-center gap-4'>
         
         <Sheet  key={'left'}>
        <SheetTrigger className=' block lg:hidden'>
          <RiMenu2Line size={20}/>
        </SheetTrigger>
        <SheetContent key={'left'} className=' bg-zinc-950 border-zinc-900'>
          <div className=' flex flex-col gap-5 w-full h-full p-4 text-white'>
            <Link href='/dashboard' aria-label='Go to the dashboard' passHref>
                <div className='flex items-center justify-center space-x-3'>
                <img src="/logo 06 B.png" alt="" width={120} />
                </div>
            </Link>

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
        </SheetContent>
      </Sheet>

        { pathname === '/dashboard' && (
          <a href='/dashboard' className=' text-sm text-white'>Dashboard</a>
        )}

        { pathname === '/dashboard/usermanagement/player' && (
          <a href='/dashboard/usermanagement/player' className=' text-sm text-white'>User Management / Player</a>
        )}

          { pathname === '/dashboard/usermanagement/admins' && (
          <a href='/dashboard/usermanagement/admins' className=' text-sm text-white'>User Management / Admin</a>
        )}

        { pathname === '/dashboard/transaction' && (
          <a href='/dashboard/transaction' className=' text-sm text-white'>Transaction</a>
        )}

        { pathname === '/dashboard/rewards' && (
          <a href='/dashboard/rewards' className=' text-sm text-white'>Rewards</a>
        )}

        { pathname === '/dashboard/news' && (
          <a href='/dashboard/news' className=' text-sm text-white'>News</a>
        )}

         { pathname === '/dashboard/maintenance' && (
          <a href='/dashboard/maintenance' className=' text-sm text-white'>Maintenance</a>
        )}


      </div>
    
        <Popover>
          <PopoverTrigger>
             <div className='flex items-start gap-2'>
              <div className=' flex flex-col items-end'>
                <p className=' text-xs font-semibold'>Admin Name</p>
                <p className=' text-xs text-zinc-500'>Admin</p>

              </div>
              <div className=' h-10 w-10 bg-zinc-600 rounded-md'>

              </div>

            </div>
          </PopoverTrigger>
          <PopoverContent className=' w-[150px] p-4 bg-zinc-950 border-zinc-900 text-white mt-4'>
            <Link href='/' className=' text-sm flex items-center gap-2'><IoLogOut size={20}/>Log Out</Link>
          </PopoverContent>
        </Popover>

    </div>
  )
}
