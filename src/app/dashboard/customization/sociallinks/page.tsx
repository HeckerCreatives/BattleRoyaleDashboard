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
import { toast, useToast } from "@/components/ui/use-toast"
import axios, {AxiosError} from 'axios'
import { useRouter } from 'next/navigation'
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from 'react-icons/md'
import { Instagram, Link, Pen, Plus } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FiCheck } from 'react-icons/fi'
import { BsTelegram, BsTwitterX } from 'react-icons/bs'
import { FaTelegram } from 'react-icons/fa'




const Tab = [
    'Header Content',
    'Maps',
    'Promotional Video'
]

const Socials = [
  'facebook',
  'discord',
  'tiktok',
  'telegram'
]

interface Links {
  _id: string
  title: string
  createdAt:string 
  updatedAt: string
  link: string
  type: string
}

export default function page() {
    const [tab, setTab] = useState('Header Content')
    const [type, setType] = useState('')
    const [link, setLink] = useState('')
    const router = useRouter()
    const [list, setList] = useState<Links[]>([])
    const [investor, setInvestor] = useState<Links[]>([])
    const [open, setOpen] = useState(false)

    useEffect(() => {
      const fetchContent = async () => {
          try {
              const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/sociallinks/getsociallinks?page&limit`, {
                  withCredentials: true,
                  headers: {
                      'Content-Type': 'application/json',
                  },
              });

              setList(response.data.data)
          
          } catch (error) {
              if (axios.isAxiosError(error)) {
                  const axiosError = error as AxiosError<{ message: string, data: string }>;
                  if (axiosError.response && axiosError.response.status === 401) {
                      router.push('/');
                      toast({
                          variant: "destructive",
                          title: `${axiosError.response.data.message}`,
                          description: `${axiosError.response.data.data}`
                      });
                  } else if (axiosError.response && axiosError.response.status === 400) {
                      toast({
                          variant: "destructive",
                          title: `${axiosError.response.data.message}`,
                          description: `${axiosError.response.data.data}`
                      });
                  }
              }
          }
      };
  
      fetchContent();
  }, [type]);


  const fetchContent = async () => {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/sociallinks/getsociallinks?page&limit`, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        setList(response.data.data)
    
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError<{ message: string, data: string }>;
            if (axiosError.response && axiosError.response.status === 401) {
                router.push('/');
                toast({
                    variant: "destructive",
                    title: `${axiosError.response.data.message}`,
                    description: `${axiosError.response.data.data}`
                });
            } else if (axiosError.response && axiosError.response.status === 400) {
                toast({
                    variant: "destructive",
                    title: `${axiosError.response.data.message}`,
                    description: `${axiosError.response.data.data}`
                });
            }
        }
    }
};

  const addLink = async (id: string) => {

    if(link.includes('https://')){
      try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/sociallinks/editsociallink`,
             {
               id: id,
              title: type, // facebook, twitter, etc...
              link: link
             }, 
             {                
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    }
             })
             if ( response.data.message === 'success'){
              setOpen(false)
                  fetchContent()
                   toast({
                    description:(<div className=' flex items-center gap-2'><FiCheck size={20} /><p>Link has saved sucessfully</p></div>)
                    })
            }

             if ( response.data.message === 'failed'){
              setOpen(false)
                
                  toast({
                    variant:'destructive',
                    description:(<div className=' flex items-center gap-2'><FiCheck size={20} /><p>{response.data.data}</p></div>)
                    })
            }
           
    } catch (error) {
      setOpen(false)

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
    }else {
      toast({
        variant: "destructive",
        title: `Link should start with https://`,
        
        })
    }

        
  }


  const getImage = (type: string) => {
    if(type === 'instagram'){
      return  <Instagram size={32} className=' bg-orange-300 p-1 rounded-full text-amber-950 hover:scale-110 ease-in-out duration-300'/>
    }  else if(type === 'x'){
      return  <BsTwitterX size={32} className=' bg-orange-300 p-1 rounded-full text-amber-950 hover:scale-110 ease-in-out duration-300'/>
    } else {
      return <FaTelegram size={32} className=' bg-orange-300 p-1 rounded-full text-amber-950 hover:scale-110 ease-in-out duration-300'/>
    }

  }



    

    
  return (
    <div className=' flex w-full'>
       

           <div className=' w-full flex flex-col p-8'>
            <p className=' text-lg font-semibold'>Social Links</p>

            {/* <Dialog>
            <DialogTrigger className=' mt-8 w-fit bg-orange-600 flex items-center gap-1 px-4 py-2 text-xs rounded-sm'><Plus size={15}/>Add link</DialogTrigger>
            <DialogContent className=' flex flex-col gap-1 text-white max-w-[500px] w-full bg-zinc-950 border-zinc-800'>
              <DialogHeader>
                <DialogTitle>Add link</DialogTitle>
                <DialogDescription>
               
                </DialogDescription>

                


              </DialogHeader>
              <label htmlFor="" className=' text-xs text-zinc-500 mt-2'>Type</label>
                <Select 
            value={type}
            onValueChange={setType}
              >
                <SelectTrigger className='w-full p-4 bg-zinc-900 rounded-md border-none'>
                    <SelectValue placeholder="Select Type"/>
                </SelectTrigger>
                <SelectContent>
                  {
                    Socials.map((item, index) => (
                      <SelectItem key={index} value={item}>{item}</SelectItem>

                    ))
                  }
                </SelectContent>
              </Select>

              <label htmlFor="" className=' text-xs text-zinc-500 mt-2'>Link</label>
              <input value={link} onChange={(e) => setLink(e.target.value)} placeholder='Link' className=' p-3 bg-zinc-900 rounded-md text-sm'/>

              <button  className=' w-fit px-4 py-2 text-sm bg-orange-600 rounded-sm mt-4'>Save</button>

            </DialogContent>
          </Dialog> */}

            <div className=' grid auto-cols-min grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8'>
              {list.map((item,index) => (
                <div key={item._id} className='bg-zinc-900 flex flex-col gap-2 p-4'>
                  <div className=' flex items-center gap-2'>
                    {getImage(item.title)}
                    <p className=' text-lg font-semibold uppercase'>{item.title}</p>
                  </div>

                <div className=' w-full flex items-center gap-2'>
                  <input type="text" value={item.link} className=' w-full p-2 text-white bg-zinc-600 rounded-sm text-xs' />

                  <Dialog>
                      <DialogTrigger onClick={() => {setType(item.title), setLink(item.link)}} className='  bg-orange-600 text-white p-2 rounded-sm'>
                        <Pen size={15}/>
                      </DialogTrigger>
                      <DialogContent className=' flex flex-col gap-1 text-white h-auto max-w-[500px] w-full bg-zinc-950 border-zinc-800'>
                        <DialogHeader>
                          <DialogTitle>Edit {item.title} Link</DialogTitle>
                          <DialogDescription>
                        
                          </DialogDescription>
                        </DialogHeader>

                        <label htmlFor="" className=' text-xs text-zinc-500 mt-2'>Link</label>
                        <input value={link} onChange={(e) => setLink(e.target.value)} placeholder='Link' className=' p-3 bg-zinc-900 rounded-md text-sm mb-4'/>

                        <button onClick={() => addLink(item._id)} className=' w-fit px-4 py-2 text-sm bg-orange-600 rounded-sm'>Save</button>
                      </DialogContent>
                    </Dialog>

                </div>

              </div>
              ))}

            </div>

         
           </div>
 
    </div>
  )
}
