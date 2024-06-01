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
    const [list, setList] = useState<List[]>([])
   
    useEffect(() => {
        const list = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/maintenance/getmaintenance`,{
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        }
                })
                setList(response.data.data.maintenancelist)
                console.log(response.data)
            } catch (error) {
                 if (axios.isAxiosError(error)) {
                    const axiosError = error as AxiosError<{ message: string, data: string }>;
                    if (axiosError.response && axiosError.response.status === 401) {
                        router.push('/')
                        toast({
                        variant:'destructive',
                        title: `${axiosError.response.data.message}`,
                        description: `${axiosError.response.data.data}`
                        })
                
                    }
                } 
                
            }
        }
        list()
    },[])


    
  return (
    <div className=' flex w-full h-screen'>
        <Sidebar/>
        <main className=' bg-zinc-900 w-full text-white'>
           <Header/>

         
            <div className=' flex flex-col gap-8 w-full p-4 md:p-8'>     
                <div className=' flex items-center gap-4'>
                    
                    <div className=' flex items-center gap-2'>
                        
                    
                    </div>

                    

                </div>
                    
                
                <Table>
                <TableHeader className=' bg-zinc-950 hover:bg-zinc-950 text-white'>
                    <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead >Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {list.map((lists, idx)=>(
                         <TableRow key={idx} className=' bg-[#080808b4]'>
                        <TableCell>{lists.value}</TableCell>
                        <TableCell>{lists.type}</TableCell>
                        <TableCell className=' flex items-center gap-2' >
                            <button className=' text-xs px-2 py-1 bg-blue-800 rounded-md'>View</button>
                            <button className=' text-xs px-2 py-1 bg-secondary rounded-md'>Edit</button>
                            <button className=' text-xs px-2 py-1 bg-red-600 rounded-md'>Delete</button>
                        </TableCell>
                        </TableRow>
                    ))}
                   
                </TableBody>
                </Table>
            </div>
             
        </main>
      

    </div>
  )
}
