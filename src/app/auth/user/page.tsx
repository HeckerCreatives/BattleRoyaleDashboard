"use client"

import React, { useEffect, useState } from 'react'
import axios, { AxiosError} from 'axios';
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from 'next/navigation';
import { Input } from "@/components/ui/input"
import { IoMdArrowBack } from "react-icons/io";
import { WalletLogin } from '@/components/auth/WalletLogin';


export default function login() {
  const [playerusername, setPlayerusername] = useState('')
  const [playerpassword, setPlayerpassword] = useState('')
  const [ loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

    const back = () => {
      router.push('/auth/user/')
    }


  return (
    <div className=' relative bg-[#141414] w-screen h-screen flex items-center justify-center '
     style={{backgroundImage: "url('/login/BG.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat:"no-repeat"}}
    >


     
      <a href="/auth/user/">
        <img src="/login/Rise of Fearless plain.png" width={100} alt="" className=' hidden xl:block absolute top-8 left-8'/>
      </a>

      <div className=' h-screen w-full flex items-center justify-center'>
        <div className=' relative grid grid-cols-1 md:grid-cols-2 w-[95%] md:w-[700px] xl:w-[800px] bg-red-900 rounded-md'
     style={{backgroundImage: "url('/login/Login Tab.png')", backgroundSize: "cover", backgroundPosition: "bottom", backgroundRepeat:"no-repeat"}}
        
        >

          <div className=' w-full flex flex-col items-start gap-4 mt-4 p-8'>

          <div className=' flex flex-col mt-8'>
            <img src="/login/Rise of Fearless plain.png" width={100} alt="" className=' xl:hidden block'/>

            <p className=' text-lg font-semibold text-orange-300 w-full'>Log in with username or Metamask Wallet</p>
            <p className=' text-xs text-zinc-400 mb-6'>Enter your account details</p>

          </div>

        <WalletLogin/>


        <button
            onClick={() => router.push('/auth/user/username')}
            className=' flex items-center justify-center gap-2 py-2 w-full lg:text-sm xl:text-sm font-bold text-amber-950 ease-in-out duration-200 bg-gradient-to-r from-orange-300 to-orange-400 rounded-md'
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
                Log In With Username</button>
                



                          <p className=' text-xs text-zinc-400 mt-16 flex items-center gap-6'>Do you have an account?<a href="/auth/user/register" className=' text-xs font-semibold px-4 py-1 border-2 border-orange-400 rounded-md text-orange-400'>Register</a></p>
          </div>

          <img src="/login/Login Tab Character.png" width={300} alt="" className=' absolute bottom-0 right-0 md:block hidden'/>
    
        </div>
      </div>
        

      
     
    </div>
  )
}
