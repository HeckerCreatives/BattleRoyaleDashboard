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
    const [loading, setLoading] = useState(false)

    const [oldpw, setOldpw] = useState('')
    const [newpw, setnewpw] = useState('')
    const [confirmpw, setconfirmpw] = useState('')

    const changepassword = async () => {
      setLoading(true)
      if(oldpw === ''){
          setLoading(false)

         toast({
            variant:'destructive',
            title: `Please enter your old password`,
        
            })
      }

       if(newpw === ''){
          setLoading(false)

         toast({
            variant:'destructive',
            title: `Please enter a new password`,
        
            })
      }

      if(newpw !== confirmpw){
          setLoading(false)

         toast({
            variant:'destructive',
            title: `Password does not match`,
        
            })
      }

      if( oldpw !== '' && newpw === confirmpw){
         try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/staffusers/changepassword`,{
          oldpw: oldpw,
          newpw: newpw
        },{
          withCredentials: true,
              headers: {
              'Content-Type': 'application/json',
                }
        })
        console.log(response.data)
        if(response.data.message === 'success'){
          setLoading(false)
          toast({
            title: `${response.data.message}`,
            description: `${response.data.data}`
            })
        }

        if(response.data.message === 'failed'){
          setLoading(false)
          toast({
            variant:'destructive',
            title: `${response.data.message}`,
            description: `${response.data.data}`
            })
        }
      } catch (error) {
          setLoading(false)
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
                           <Input placeholder='Old password' value={oldpw} onChange={(e) => setOldpw(e.target.value)} type='password' className=' bg-zinc-900 border-none w-full'/>
                           <Input placeholder='New password' value={newpw} onChange={(e) => setnewpw(e.target.value)} type='password' className=' bg-zinc-900 border-none w-full'/>
                           <Input placeholder='Confirm new password' value={confirmpw} onChange={(e) => setconfirmpw(e.target.value)} type='password' className=' bg-zinc-900 border-none'/>
                            <button
                            onClick={changepassword}
                            disabled={loading}
                            style={{backgroundImage: "url('/button.png')", backgroundSize: "contain",backgroundPosition: "center", backgroundRepeat:"no-repeat"}}
                            className=' h-16 w-[200px] mt-4 text-xs font-bold text-amber-950 hover:scale-105 ease-in-out duration-200 flex items-center justify-center gap-2'
                            >
                              {loading === true && (
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
                              Change Password</button>
                        </div>
                    </div>

                  </div>
                )}

                

           </div>
        </main>
      

    </div>
  )
}
