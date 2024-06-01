"use client"

import Sidebar from '@/components/Sidebar'
import React, { useState } from 'react'
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
import { FaDollarSign } from "react-icons/fa";



export default function page() {
    const [tab, setTab] = useState('topup')

  return (
    <div className=' flex w-full h-full'>
        <Sidebar/>
        <main className=' bg-zinc-900 w-full text-white'>
           <Header/>

           <div className=' w-full h-[500px] flex items-center justify-center'>
            <p className=' text-sm text-zinc-300'>Coming Soon!</p>

           </div>
             
        </main>
      

    </div>
  )
}
