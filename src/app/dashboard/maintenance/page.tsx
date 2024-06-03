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
                console.log(response.data)
                setList(response.data.data.maintenancelist)
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

            <div className=' w-full h-[500px] flex flex-col items-center justify-center p-4 md:p-10'>

                <div className=' relative w-full h-[180px] bg-red-500 rounded-lg flex items-end p-6 shadow-lg overflow-hidden'
                style={{backgroundImage: "url('/maintenance.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat:"no-repeat"}}
                >
                    <div className=' absolute top-0 left-0 w-full h-full bg-gradient-to-r from-[#000000] to-[#00000000] rounded-lg'>

                    </div>
                    {/* <div className="wrapper nine">
                        <div>
                            <h3 className="rotate">
                                <span className='text-2xl font-bold text-secondary'>M</span>
                                <span className='text-2xl font-bold text-secondary'>a</span>
                                <span className='text-2xl font-bold text-secondary'>i</span>
                                <span className='text-2xl font-bold text-secondary'>n</span>
                                <span className='text-2xl font-bold text-secondary'>t</span>
                                <span className='text-2xl font-bold text-secondary'>e</span>
                                <span className='text-2xl font-bold text-secondary'>n</span>
                                <span className='text-2xl font-bold text-secondary'>a</span>
                                <span className='text-2xl font-bold text-secondary'>n</span>
                                <span className='text-2xl font-bold text-secondary'>c</span>
                                <span className='text-2xl font-bold text-secondary'>e</span>
                            </h3>
                        </div>
                    </div> */}
                    <h2 className=' relative z-10 text-2xl font-bold text-secondary'>Maintenance</h2>

                </div>
               <div className=' w-full h-full mt-6'>

                <Table className=''>
                <TableHeader className=' bg-zinc-950'>
                    <TableRow>
                    <TableHead className="">Value</TableHead>
                    <TableHead>Type</TableHead>
                    
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {list.map(( lists, idx) => (
                        <TableRow className='bg-[#080808b4]'>
                        <TableCell className="font-medium">{lists.value}</TableCell>
                        <TableCell>{lists.type}</TableCell>
                    
                        </TableRow>
                    ))}
                    
                </TableBody>
                </Table>

               </div>

           </div>
        </main>
      

    </div>
  )
}
