"use client"

import Sidebar from '@/components/Sidebar'
import React from 'react'
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
import { Checkbox } from "@/components/ui/checkbox"
import { BsPersonPlusFill } from "react-icons/bs";
import { FaUsers } from "react-icons/fa";
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { HiOutlinePlusSm } from "react-icons/hi";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"



export default function page() {
  return (
    <div className=' flex w-full h-screen md:h-screen'>
      
            <div className=' flex flex-col gap-8 w-full p-4 md:p-8'>
               <div className=' relative w-full h-[180px] rounded-lg flex items-end p-6 shadow-lg border-[1px] border-opacity-50 border-orange-300'
                style={{backgroundImage: "url('/dashboard/assets/Tab.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat:"no-repeat"}}

                >
                   
                    <h2 className=' relative z-10 text-2xl font-bold text-secondary'>Rewards</h2>

                </div>     

                <div className=' grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>

                    <div className=' flex flex-col gap-5 items-center justify-center w-full h-auto rounded-lg p-4 border-[1px] border-orange-300 border-opacity-30'
                    style={{backgroundImage: "url('/userdashboard/Assets/TAB HOLDER small.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat:"no-repeat"}}
                    
                    >
                        <p className=' text-sm font-semibold'>Grant ingame currency</p>

                        <div className=' flex flex-col gap-2 items-center p-2'>
                           <Input placeholder='Amount' type='number' className=' bg-zinc-900 border-none'/>
                           <Input placeholder='Player username' type='text' className=' bg-zinc-900 border-none'/>
                            <button
                            style={{backgroundImage: "url('/button.png')", backgroundSize: "contain",backgroundPosition: "center", backgroundRepeat:"no-repeat"}}
                            className=' h-10 w-[150px] mt-4 text-xs font-bold text-amber-950 hover:scale-105 ease-in-out duration-200 flex items-center justify-center gap-2'
                            >Grant</button>
                        </div>
                    </div>

                 
                </div>           
              
            </div>
             
     

    </div>
  )
}
