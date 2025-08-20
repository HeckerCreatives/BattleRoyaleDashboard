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
import { MdOutlineFileUpload } from "react-icons/md";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FaMessage } from 'react-icons/fa6';
import { MessageCircle } from 'lucide-react';


export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const [selectedImage, setSelectedImage] = useState<string | ArrayBuffer | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

   const handleLogout = () => {
    Cookies.remove('sessionToken'); 
    router.push('/');
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
            href='/dashboard/newsletter'
            className={`flex items-center space-x-4 px-3 py-2 text-sm hover:text-secondary ease-in-out duration-300 ${pathname === '/dashboard/newsletter/' && ' text-secondary'}`}
            role='menuitem'
            passHref
          >
            <IoIosMail size={20}/>
            <span>Newsletter</span>
          </Link>

          <Collapsible>
          <CollapsibleTrigger className=' flex items-center justify-between'>

           <p
              className={`flex items-center space-x-4 px-3 py-2 text-sm hover:text-secondary ease-in-out duration-300 ${pathname.includes('/dashboard/customization/') && ' text-secondary'}`}
              role='menuitem'
            >
              <FaEdit size={20}/>
              <span>Customization</span>
            </p>

            <IoIosArrowDown size={10}/>
           
          </CollapsibleTrigger>
          <CollapsibleContent className=' flex flex-col gap-2 pl-4'>
             <Link
              href='/dashboard/customization/landingpage'
              className={`flex items-center space-x-4 px-3 py-2 text-sm hover:text-secondary ease-in-out duration-300 ${pathname.includes('/dashboard/customization/landingpage') && ' text-secondary'}`}
              passHref
            >
              <MdWeb size={20}/>
              <span>Landing Page</span>
            </Link>

            <Link
              href='/dashboard/customization/sociallinks'
              className={`flex items-center space-x-4 px-3 py-2 text-sm hover:text-secondary ease-in-out duration-300 ${pathname.includes('/dashboard/customization/sociallinks') && ' text-secondary'}`}
              passHref
            >
              <MessageCircle size={20}/>
              <span>Socials links</span>
            </Link>

           

            
          </CollapsibleContent>
        </Collapsible>


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

        </div>
        </SheetContent>
      </Sheet>

        { pathname === '/dashboard/' && (
          <a href='/dashboard' className=' text-xs md:text-sm text-white'>Dashboard</a>
        )}

        { pathname === '/dashboard/usermanagement/player/' && (
          <a href='/dashboard/usermanagement/player' className=' text-xs md:text-sm text-white'>User Management / Player</a>
        )}

          { pathname === '/dashboard/usermanagement/admins/' && (
          <a href='/dashboard/usermanagement/admins' className=' text-xs md:text-sm text-white'>User Management / Admin</a>
        )}

        { pathname === '/dashboard/transaction/' && (
          <a href='/dashboard/transaction' className=' text-xs md:text-sm text-white'>Transaction</a>
        )}

        { pathname === '/dashboard/rewards/' && (
          <a href='/dashboard/rewards' className=' text-xs md:text-sm text-white'>Rewards</a>
        )}

        { pathname === '/dashboard/news/' && (
          <a href='/dashboard/news' className=' text-xs md:text-sm text-white'>News</a>
        )}

         { pathname === '/dashboard/maintenance/' && (
          <a href='/dashboard/maintenance' className=' text-xs md:text-sm text-white'>Maintenance</a>
        )}

         { pathname === '/dashboard/message/' && (
          <a href='/dashboard/message' className=' text-xs md:text-sm text-white'>Message</a>
        )}

         { pathname === '/dashboard/settings/' && (
          <a href='/dashboard/seetings' className=' text-xs md:text-sm text-white'>Account Settings</a>
        )}

         { pathname === '/dashboard/game/' && (
          <a href='/dashboard/game' className=' text-xs md:text-sm text-white'>Game</a>
        )}

        { pathname === '/dashboard/marketplace/' && (
          <a href='/dashboard/marketplace' className=' text-xs md:text-sm text-white'>Marketplace</a>
        )}


      </div>
    
        <Popover>
          <PopoverTrigger>
             <div className='flex items-start gap-2'>
              <div className=' flex flex-col items-end'>
                <p className=' text-xs font-semibold'>Name</p>
                <p className=' text-xs text-zinc-500'>Super Admin</p>

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
