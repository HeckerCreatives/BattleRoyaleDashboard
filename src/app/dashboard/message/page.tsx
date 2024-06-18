"use client"
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
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import axios, {AxiosError} from 'axios'
import { useRouter } from 'next/navigation'




export default function page() {
    const { toast } = useToast()
    const router = useRouter()
    const [ title, setTitle] = useState('')
    const [ description, setDescription] = useState('')
    const [loading, setLoading] = useState(false)
    const [ type, setType] = useState('')

     const massNews = async () => {
        setLoading(true)
        if( title === ''){
        setLoading(false)
             toast({
            variant: "destructive",
            title: "Enter a news title",
            })
        }
        if( description === ''){
        setLoading(false)
             toast({
            variant: "destructive",
            title: "Enter a news description",
            })
        }

        if( type === ''){
        setLoading(false)
             toast({
            variant: "destructive",
            title: "Select type message",
            })
        }

        if(title !== '' && description !== '' && type !== ''){
            try {
                const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/inbox/newsmessage`,{
                    title: title,
                    description: description,
                    type: type
                },{
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                        }
                })
                if ( response.data.message === 'success'){
                    setLoading(false)
                    setTitle('')
                    setDescription('')
                    setType('')
                      toast({
                        title: "Success",
                        description:'News successfully created'
                        })
                }

                 if ( response.data.message === 'failed'){
                    setLoading(false)
                      toast({
                        title: "Failed",
                        description:`${response.data.data}`
                        })
                }
            } catch (error) {
                 if (axios.isAxiosError(error)) {
                    const axiosError = error as AxiosError<{ message: string, data: string }>;
                    if (axiosError.response && axiosError.response.status === 401) {
                        router.push('/')
                        toast({
                        variant: "destructive",
                        title: `${axiosError.response.data.message}`,
                        description: `${axiosError.response.data.data}`
                        })
                
                    }

                      if (axiosError.response && axiosError.response.status === 400) {
                        const errorMessage = axiosError.response.data?.message;
                        toast({
                        variant: "destructive",
                        title: `${axiosError.response.data.message}`,
                        description: `${axiosError.response.data.data}`
                        })
                
                    }
                } 
                
            }
        }
        
    }
  return (
    <div className=' flex w-full h-full bg-zinc-900'>
        <Sidebar/>
        <main className=' bg-zinc-900 w-full text-white'
        style={{backgroundImage: "url('/dashboard/assets/BG.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat:"no-repeat"}}
        
        >
            <Header/>

            <div className=' flex flex-col gap-4 w-full p-4 md:p-10'
            
            >
                <div className=' w-full h-auto p-4 md:p-8 border-2 border-orange-300 border-opacity-50 rounded-lg'
                style={{backgroundImage: "url('/messages/Asset/Big Tab.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat:"no-repeat"}}
                
                >
                    <p className=' text-lg font-semibold py-2 border-b-2 bg-amber-800 border-orange-400 px-6 mb-8'>Message</p>
                    <div className=' w-full flex flex-col gap-4'>
                    <Select onValueChange={setType} value={type}>
                    <SelectTrigger className="w-[180px] bg-zinc-950 border-none text-white">
                        <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent className=' bg-zinc-950 border-zinc-900 text-white'>
                        <SelectItem value="announcement">Announcement</SelectItem>
                    </SelectContent>
                    </Select>

                    <div className=' w-full flex flex-col'>
                        <p className=' text-sm text-orange-300 bg-zinc-900 py-1 px-4 rounded-t-md'>Title</p>
                        <Input placeholder='Title' value={title} onChange={(e)=> setTitle(e.target.value)} className=' bg-zinc-950 border-none' />

                    </div>

                    <div className=' w-full flex flex-col'>
                        <p className=' text-sm text-orange-300 bg-zinc-900 py-1 px-4 rounded-t-md'>Descriptio:</p>
                        <Textarea placeholder='Description' value={description} onChange={(e)=> setDescription(e.target.value)} className=' bg-zinc-950 border-none h-[300px]'/>

                    </div>

                    <div className=' w-full flex'>
                        <button
                        onClick={massNews}
                        className=' h-10 w-[220px] text-sm font-bold text-amber-950 hover:scale-105 ease-in-out duration-200 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-200 to-orange-400 rounded-md'
                        >
                            { loading === true && (
                                <div className="loader">
                                            <div className="bar1 bg-zinc-950"></div>
                                            <div className="bar2 bg-zinc-950"></div>
                                            <div className="bar3 bg-zinc-950"></div>
                                            <div className="bar4 bg-zinc-950"></div>
                                            <div className="bar5 bg-zinc-950"></div>
                                            <div className="bar6 bg-zinc-950"></div>
                                            <div className="bar7 bg-zinc-950"></div>
                                            <div className="bar8 bg-zinc-950"></div>
                                            <div className="bar9 bg-zinc-950"></div>
                                            <div className="bar10 bg-zinc-950"></div>
                                            <div className="bar11 bg-zinc-950"></div>
                                            <div className="bar12 bg-zinc-950"></div>
                                        </div>
                            )}
                            Mass message</button>

                    </div>

                    

                    </div>
                </div>

                
            </div>
             
        </main>

    </div>
  )
}
