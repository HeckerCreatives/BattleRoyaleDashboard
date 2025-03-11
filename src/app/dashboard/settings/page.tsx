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
import { RiCloseFill } from "react-icons/ri";
import { FiCheck } from "react-icons/fi";
import { Eye, EyeOff } from 'lucide-react'

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
 
    const [showPasswords, setShowPasswords] = useState({
      old: false,
      new: false,
      confirm: false,
    });

    const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
      setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
    };

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
        if(response.data.message === 'success'){
          setLoading(false)
          toast({
            description: (<div className=' flex items-center gap-2'><FiCheck size={20} /><p>{response.data.data}</p></div>)
            })
        }

        if(response.data.message === 'failed'){
          setLoading(false)
          toast({
            variant:'destructive',
            description: (<div className=' flex items-center gap-2'><RiCloseFill size={20} /><p>{response.data.data}</p></div>)
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
    <div className=' flex w-full h-auto '>
        <Sidebar/>
        <main className=' bg-zinc-900 w-full text-white'
        style={{backgroundImage: "url('/dashboard/assets/BG.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat:"no-repeat"}}
        
        >
           <Header/>

            <div className=' w-full h-screen flex flex-col items-center p-4 md:p-10 overflow-y-auto '>
               <div className=' relative w-full h-[180px] bg-red-500 rounded-lg flex items-end p-6 shadow-lg border-[1px] border-opacity-50 border-orange-300'
                style={{backgroundImage: "url('/dashboard/assets/Tab.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat:"no-repeat"}}

                >
                    <h2 className=' relative z-10 text-2xl font-bold text-secondary'>Manage Account</h2>

                </div>    
               
                  <div className=' w-full mt-8'>

                   <div className=' relative grid grid-cols-1 md:grid-cols-2 items-center w-full md:w-[80%] lg:w-[70%] h-[400px] rounded-lg bg-zinc-950 border-[1px] border-orange-300 border-opacity-30'
                    style={{backgroundImage: "url('/userdashboard/Assets/TAB HOLDER small.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat:"no-repeat"}}
                   
                   >
                    <p className=' w-full py-2 px-4 text-xl font-semibold text-orange-100 absolute top-4 left-4 bg-gradient-to-r from-amber-900 to-[#00000000]'>Change Password</p>
                    <div className='flex flex-col gap-2 items-start p-8 mt-10'>
                    {[
                      { label: 'Old password', value: oldpw, setter: setOldpw, key: 'old' as keyof typeof showPasswords },
                      { label: 'New password', value: newpw, setter: setnewpw, key: 'new' as keyof typeof showPasswords },
                      { label: 'Confirm new password', value: confirmpw, setter: setconfirmpw, key: 'confirm' as keyof typeof showPasswords }
                    ].map(({ label, value, setter, key }) => (
                      <div key={key} className='relative w-full'>
                        <Input
                          placeholder={label}
                          value={value}
                          onChange={(e) => setter(e.target.value)}
                          type={showPasswords[key] ? 'text' : 'password'}
                          className='bg-zinc-900 border-none w-full pr-10'
                        />
                        <button
                          type='button'
                          onClick={() => togglePasswordVisibility(key)}
                          className='absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-white'
                        >
                          {showPasswords[key] ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    ))}


                          <div className='flex items-end justify-end w-full'>
                            <button
                              onClick={changepassword}
                              disabled={loading}
                              className='w-[200px] py-3 mt-4 text-xs font-bold text-amber-950 hover:scale-105 ease-in-out duration-200 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-200 to-orange-400 rounded-md'
                            >
                              {loading && (
                                <div className='loader'>
                                  {[...Array(12)].map((_, i) => (
                                    <div key={i} className={`bar${i + 1} bg-zinc-950`}></div>
                                  ))}
                                </div>
                              )}
                              Change Password
                            </button>
                          </div>
                        </div>

                        <div className=' w-full h-full relative'>
                           <img src="/userdashboard/Assets/Character B.png" alt="" width={300} className=' absolute bottom-0 right-0 z-20 md:block hidden' />
                            <img src="/userdashboard/Assets/Character A.png" alt="" width={400} className=' absolute bottom-0 right-0 md:block hidden' />
                        </div>
                    </div>

                  </div>

                

           </div>
        </main>
      

    </div>
  )
}
