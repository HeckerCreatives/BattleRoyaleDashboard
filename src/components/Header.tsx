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
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie'
import { NAV_ITEMS, NavGroupItem, NavLinkItem } from './Sidebar';
import Breadcrumb from './breadcrumb';


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
        <SheetContent key={'left'} className=' bg-zinc-950 border-zinc-900 overflow-y-auto'
         style={{backgroundImage: "url('/dashboard/assets/Left Rectangular.png')", backgroundSize: "cover", backgroundPosition: "right", backgroundRepeat:"no-repeat"}}
        >
          <div className=' flex flex-col gap-5 w-full h-full p-4 text-white '>
            <Link href='/dashboard/' aria-label='Go to the dashboard' passHref>
                <div className='flex items-center justify-center space-x-3'>
                <img src="/logo 06 B.png" alt="" width={120} />
                </div>
            </Link>
      
              <div className="flex flex-col gap-2 w-full">
                {NAV_ITEMS?.map((item) =>
                  item.type === 'link' ? (
                    <NavLinkItem key={item.href} item={item} pathname={pathname} />
                  ) : (
                    <NavGroupItem key={item.label} item={item} pathname={pathname} />
                  )
                )}
              </div>


        </div>
        </SheetContent>
      </Sheet>

      <Breadcrumb/>

       


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
