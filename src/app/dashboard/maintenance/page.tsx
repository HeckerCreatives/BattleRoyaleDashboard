"use client"
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
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
import { Switch } from "@/components/ui/switch"


interface List {
    value: number;
    type: string
}


export default function page() {
    const { toast } = useToast()
    const router = useRouter()
    const [toggle, setToggle] = useState('0')
    const [value, setValue] = useState<boolean>(false)


    useEffect(()=>{
      if (toggle === '1'){
        setValue(true)
      } else {
        setValue(false)
      }
    },[toggle])
   
   useEffect(() => {
    const fetchInitialState = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/maintenance/getmaintenance`, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          }
        });
        setToggle(response.data.data.maintenancelist[0].value);
      
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError<{ message: string; data: string }>;
          if (axiosError.response && axiosError.response.status === 401) {
            router.push('/');
            toast({
              variant: 'destructive',
              title: `${axiosError.response.data.message}`,
              description: `${axiosError.response.data.data}`,
            });
          }
        }
      }
    };
    fetchInitialState();
  }, []);

  const onOff =  async (newValue: boolean) => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/maintenance/changemaintenance`,{
                type: "fullgame",
                value: newValue ? 1 : 0
            }, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    }
            })
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

  const handleSwitchChange = (checked: boolean) => {
  setValue(checked);
  onOff(checked);
};
  return (
    <div className=' flex w-full h-screen'>
        <Sidebar/>
        <main className=' bg-zinc-900 w-full text-white'
        style={{backgroundImage: "url('/dashboard/assets/BG.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat:"no-repeat"}}
        
        >
           <Header/>

            <div className=' w-full h-[500px] flex flex-col items-center justify-center p-4 md:p-10'>

                <div className=' relative w-full h-[180px] rounded-lg flex items-end p-6 shadow-lg overflow-hidden border-[1px] border-opacity-50 border-orange-300'
                style={{backgroundImage: "url('/dashboard/assets/Tab.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat:"no-repeat"}}

                >
                    <div className=' absolute top-0 left-0 w-full h-full bg-gradient-to-r from-[#000000] to-[#00000000] rounded-lg'>

                    </div>
                   
                    <h2 className=' relative z-10 text-2xl font-bold text-secondary'>Maintenance</h2>

                </div>
               <div className=' w-full h-full mt-6'>

             

                <div className=' grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-4'>

                    <div className=' flex items-center justify-center w-full h-[150px] lg:h-[200px] rounded-lg bg-zinc-950 p-4'
                    style={{backgroundImage: "url('/maintenance/Assets/TAB A.png')", backgroundSize: "cover", backgroundPosition: "left", backgroundRepeat:"no-repeat"}}
                    
                    >
                      <div className=' w-[50%]'>

                      </div>

                      <div className=' flex flex-col items-center justify-center gap-4'>
                         <p className=' text-lg font-semibold text-center h-12 text-amber-950'>Maintenance Fullgame</p>
                        <Switch
                        checked={value}
                        onCheckedChange={handleSwitchChange}
                          />
                      </div>
                       
  
                    </div>

                    <div className=' flex items-center justify-center w-full h-[150px] lg:h-[200px] rounded-lg bg-zinc-950 p-4'
                    style={{backgroundImage: "url('/maintenance/Assets/TAB B.png')", backgroundSize: "cover", backgroundPosition: "left", backgroundRepeat:"no-repeat"}}
                    
                    >

                       <div className=' w-[50%]'>

                      </div>

                      <div className=' flex flex-col items-center justify-center gap-4'>
                         <p className=' text-lg font-semibold text-center h-12 text-amber-950'>Maintenance In-Game Queue</p>
                        <Switch
                       
                          />
                      </div>
                        
  
                    </div>

                 
                </div>           

               </div>

           </div>
        </main>
      

    </div>
  )
}
