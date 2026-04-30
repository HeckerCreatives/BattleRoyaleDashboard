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
import { MdDelete } from "react-icons/md";
import { useToast } from "@/components/ui/use-toast"
import axios, {AxiosError} from 'axios'
import { useRouter } from 'next/navigation'




export default function page() {
    const { toast } = useToast()
    const router = useRouter()
    const [loading, setLoading] = useState(false)

  
  return (
    <div className=' flex w-full h-screen'>
     
         
            <div className=' flex flex-col gap-8 w-full p-4 md:p-8'>

                <div className=' grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4'>

                    <div className=' flex flex-col gap-5 items-center justify-center w-full h-[180px] rounded-lg bg-zinc-950 p-4'>
                        <BsPersonPlusFill size={30} className=' text-secondary'/>

                        <div className=' flex flex-col gap-2 items-center p-2'>
                            <p className=' text-xl font-semibold'>12,967</p>
                            <p className=' text-xs text-zinc-200'>Total Joinings</p>

                        </div>
                    </div>

                    <div className=' flex flex-col gap-5 items-center justify-center w-full h-[180px] rounded-lg bg-zinc-950 p-4'>
                        <FaUsers size={30} className=' text-secondary'/>

                        <div className=' flex flex-col gap-2 items-center p-2'>
                            <p className=' text-xl font-semibold'>1,478</p>
                            <p className=' text-xs text-zinc-200'>Todays Joinings</p>

                        </div>
                    </div>

                </div>

                <div className=' flex items-center gap-4'>
                    <div className=' flex items-center gap-2'>
                        
                        <Dialog>
                        <DialogTrigger>
                            <button
                            style={{backgroundImage: "url('/button.png')", backgroundSize: "contain", backgroundPosition: "center", backgroundRepeat:"no-repeat"}}
                            className=' h-10 w-[220px] text-xs font-bold text-amber-950 hover:scale-105 ease-in-out duration-200 flex items-center justify-center gap-2'
                            ><HiOutlinePlusSm size={25}/>Create Admin Account</button>
                        </DialogTrigger>
                        <DialogContent className=' w-[90%] md:w-[500px] h-auto bg-zinc-950 border-zinc-900 text-white'>
                           <div className=' w-full h-full md:p-4'>
                            <p className=' text-lg font-semibold text-secondary'>Create admin account</p>

                            <div className=' grid grid-cols-2 gap-4 w-full mt-4'>

                                <div className=' flex flex-col gap-2'>
                                    <p className=' text-sm text-zinc-200'>Account Information</p>
                                    <Input placeholder='Username' type='text' className=' bg-zinc-900 border-none w-full'/>
                                    <Input placeholder='Password' type='password' className=' bg-zinc-900 border-none w-full'/>
                                    <Input placeholder='Confirm Password' type='password' className=' bg-zinc-900 border-none w-full'/>

                                </div>

                                <div className=' flex flex-col gap-2'>
                                    <p className=' text-sm text-zinc-200'>Basic Information</p>
                                    <Input placeholder='Firstname' type='text' className=' bg-zinc-900 border-none w-full'/>
                                    <Input placeholder='Lastname' type='text' className=' bg-zinc-900 border-none w-full'/>
                                    <Input placeholder='Email' type='email' className=' bg-zinc-900 border-none w-full'/>
                                    <Input placeholder='Phone' type='number' className=' bg-zinc-900 border-none w-full'/>
                                  

                                </div>

                            </div>

                            <div className=' w-full flex items-center justify-center mt-8'>
                                <button
                                style={{backgroundImage: "url('/button.png')", backgroundSize: "contain", backgroundPosition: "center", backgroundRepeat:"no-repeat"}}
                                className=' h-10 w-[180px] text-xs font-bold text-amber-950 hover:scale-105 ease-in-out duration-200 flex items-center justify-center gap-2'
                                >Create Account</button>
                            </div>

                             

                           </div>
                        </DialogContent>
                        </Dialog>


                        <button className=' flex items-center gap-1 px-4 py-2 hover:scale-105 ease-in-out duration-300 bg-red-600 text-white rounded-md text-sm'><MdDelete size={20}/>Delete</button>
                    </div>

                    

                </div>
                    
                
                <Table>
                <TableHeader className=' bg-zinc-950 hover:bg-zinc-950 text-white'>
                    <TableRow>
                    <TableHead className="w-[50px]">Select</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Date Created</TableHead>
                    <TableHead >Username</TableHead>
                    <TableHead >Email</TableHead>
                    <TableHead >Phone</TableHead>
                    <TableHead >Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow className=' bg-[#080808b4]'>
                    <TableCell className="font-medium"><Checkbox /></TableCell>
                    <TableCell>test</TableCell>
                    <TableCell>test</TableCell>
                    <TableCell >test</TableCell>
                    <TableCell >test</TableCell>
                    <TableCell >test</TableCell>
                    <TableCell className=' flex items-center gap-2' >
                        <button className=' text-xs px-2 py-1 bg-secondary rounded-md'>Edit</button>
                        <button className=' text-xs px-2 py-1 bg-red-600 rounded-md'>Delete</button>
                    </TableCell>
                    </TableRow>
                </TableBody>
                </Table>
            </div>
      

    </div>
  )
}
