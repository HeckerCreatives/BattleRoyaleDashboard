"use client"
import React, { useEffect, useState } from 'react'
import { Input } from "@/components/ui/input"
import Link from 'next/link'
import { useToast } from "@/components/ui/use-toast"
import axios, {AxiosError} from 'axios'
import { useRouter } from 'next/navigation'
import CustomBg from '@/components/CustomBg'
import Cookies from 'js-cookie'


export default function Signin() {
  const { toast } = useToast()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const auth = Cookies.get('sessionToken')
  console.log(auth)

  const handleLogin = async () => {
    setLoading(true)
    if ( password === '' ){
      setLoading(false)
       toast({
        variant: "destructive",
          title: "Form Error",
          description: "Please enter your password",
        })
    }

    if ( username === '' ){
      setLoading(false)
       toast({
        variant: "destructive",
          title: "Form Error",
          description: "Please enter your username",
        })
    }

    if ( password !== '' && username !== ''){
      setLoading(true)
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/login?username=${username}&password=${password}`,{
           withCredentials: true,
            headers: {
            'Content-Type': 'application/json',
          }
        })
        if ( response.data.message === 'success' && response.data.data.auth === 'superadmin') {
          router.push('/dashboard')
        setLoading(false)
        setUsername('')
        setPassword('')
        toast({
          title: "Success",
          description: "Successfully logged in",
        })
        }

        if ( response.data.message === 'success' && response.data.data.auth === 'admin') {
          router.push('/admin')
        setLoading(false)
        setUsername('')
        setPassword('')
        toast({
          title: "Success",
          description: "Successfully logged in",
        })
        }

        if (response.data.message === 'failed') {
          setLoading(false)
           toast({
            variant:'destructive',
          title: `${response.data.message}`,
          description: `${response.data.data}`,
        })
        }
        
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

                    if (axiosError.response && axiosError.response.status === 400) {
                        toast({
                        variant:'destructive',
                        title: `${axiosError.response.data.message}`,
                        description: `${axiosError.response.data.data}`
                        })
                
                    }

                    if (axiosError.response && axiosError.response.status === 402) {
                        toast({
                        variant:'destructive',
                        title: `${axiosError.response.data.message}`,
                        description: `${axiosError.response.data.data}`
                        })
                
                    }

                    if (axiosError.response && axiosError.response.status === 403) {
                        toast({
                        variant:'destructive',
                        title: `${axiosError.response.data.message}`,
                        description: `${axiosError.response.data.data}`
                        })
                
                    }

                    if (axiosError.response && axiosError.response.status === 404) {
                        toast({
                        variant:'destructive',
                        title: `${axiosError.response.data.message}`,
                        description: `${axiosError.response.data.data}`
                        })
                
                    }
                } 

      }
    }
    
  }

  useEffect(() => {
    if ( auth === undefined || auth === null){
      router.push('/')
    }
    if( auth !== undefined || auth !== null)
      router.push('/dashboard')
  })

  return (
    <div className=' relative bg-[#141414] w-screen h-screen flex items-center justify-center '>
        <div className=' flex flex-col gap-8 items-center justify-center w-[90%] md:w-[500px] h-auto p-8 bg-zinc-950 rounded-lg'>
            <img src="/logo 06 B.png" alt="" width={180} />
            <form  className='max-w-xs space-y-4 flex flex-col gap-2 items-center w-[80%]'>
            <Input placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} type='text' className=' bg-zinc-900 text-white border-none '/>
            <Input placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} type='password' className=' bg-zinc-900 text-white border-none '/>

            </form>

            <button
            onClick={handleLogin}
                        style={{backgroundImage: "url('/button.png')", backgroundSize: "contain", backgroundPosition: "center", backgroundRepeat:"no-repeat"}}
                        className=' flex items-center justify-center gap-2 h-12 w-[170px] text-sm font-bold text-amber-950 hover:scale-110 ease-in-out duration-200'
                      
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
            Log In</button>
        </div>
         
    </div>
  )
}
