"use client"
import React, { ChangeEvent, useEffect, useState } from 'react'
import Sidebar from '@/components/Sidebar'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Header from '@/components/Header'
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import axios, {AxiosError} from 'axios'
import { useRouter } from 'next/navigation'
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from 'react-icons/md'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { HiRefresh } from "react-icons/hi";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { IoMdEye } from "react-icons/io";
import { TiArrowLeftThick, TiArrowRightThick } from 'react-icons/ti'
import { RiCloseFill } from "react-icons/ri";
import { FiCheck } from "react-icons/fi";
import Headercontent from './Headercontent'
import Maps from './Maps'
import Promotional from './Promotional'

const Tab = [
    'Header Content',
    'Maps',
    'Promotional Video'
]

export default function page() {
    const [tab, setTab] = useState('Header Content')

    

    
  return (
    <div className=' flex w-full'>
       
            <div className=' flex flex-col gap-8 w-full p-4 md:p-8'>
                <div className=' relative w-full h-[180px] rounded-lg flex items-end p-6 shadow-lg border-[1px] border-opacity-50 border-orange-300'
                style={{backgroundImage: "url('/dashboard/assets/Tab.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat:"no-repeat"}}

                >
                    <div className=' absolute top-0 left-0 w-full h-full bg-gradient-to-r from-[#000000] to-[#00000000] rounded-lg'>

                    </div>
                    <h2 className=' relative z-10 text-2xl font-bold text-secondary'>Landing Page</h2>

                </div>  

                <div className='flex items-center gap-4'>
                    {Tab.map((item, index) => (
                        <p onClick={() => setTab(item)} key={index} className={`text-xs cursor-pointer p-2 ${tab === item && ' border-b-2 border-orange-600'}`}>{item}</p>
                    ))}
                </div> 

               {tab === 'Header Content' && (
                <Headercontent/>
               )}

                {tab === 'Maps' && (
                <Maps/>
               )}

                {tab === 'Promotional Video' && (
                <Promotional/>
               )}

                 
            </div>
             
       
    </div>
  )
}
