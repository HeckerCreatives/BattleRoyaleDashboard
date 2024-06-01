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
    <div className=' flex w-full h-screen'>
        <Sidebar/>
        <main className=' bg-zinc-900 w-full text-white'>
           <Header/>

         
            <div className=' flex flex-col gap-8 w-full p-8'>

                <div className=' grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>

                    <div className=' flex flex-col gap-5 items-center justify-center w-full h-auto rounded-lg bg-zinc-950 p-4'>
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
             
        </main>
      

    </div>
  )
}
