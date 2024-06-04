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

interface List {
    value: number;
    type: string
}


export default function page() {
    const { toast } = useToast()
    const router = useRouter()
    const [tab, setTab] = useState('changepassword')
    
  return (
    <div className=' flex w-full h-screen'>
        <Sidebar/>
        <main className=' bg-zinc-900 w-full text-white'>
           <Header/>

            <div className=' w-full flex flex-col items-center p-4 md:p-10'>
               <div className=' relative w-full h-[180px] bg-red-500 rounded-lg flex items-end p-6 shadow-lg'
                style={{backgroundImage: "url('/maintenance.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat:"no-repeat"}}
                >
                    <div className=' absolute top-0 left-0 w-full h-full bg-gradient-to-r from-[#000000] to-[#00000000] rounded-lg'>

                    </div>
                    <h2 className=' relative z-10 text-2xl font-bold text-secondary'>Manage Account</h2>

                </div>    
                <div className=' w-full flex items-center justify-start mt-4'>

                  <p onClick={() => setTab('changepassword')} className={` text-sm font-semibold px-4 py-2 cursor-default ${tab === 'changepassword' && ' border-b-2 border-secondary'}`}>Change Password</p>

                </div>

                { tab === 'changepassword' && (
                  <div className=' grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-full mt-4'>

                   <div className=' flex flex-col gap-5 items-center justify-center w-full h-auto rounded-lg bg-zinc-950 p-4'>

                        <div className=' flex flex-col gap-2 items-center p-2'>
                           <Input placeholder='New password' type='password' className=' bg-zinc-900 border-none w-full'/>
                           <Input placeholder='Confirm new password' type='password' className=' bg-zinc-900 border-none'/>
                            <button
                            style={{backgroundImage: "url('/button.png')", backgroundSize: "contain",backgroundPosition: "center", backgroundRepeat:"no-repeat"}}
                            className=' h-10 w-[150px] mt-4 text-xs font-bold text-amber-950 hover:scale-105 ease-in-out duration-200 flex items-center justify-center gap-2'
                            >Change Password</button>
                        </div>
                    </div>

                  </div>
                )}

                

           </div>
        </main>
      

    </div>
  )
}
