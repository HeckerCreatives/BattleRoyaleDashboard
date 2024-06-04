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

                {/* <Table className=''>
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
                </Table> */}

                <div className=' grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>

                    <div className=' flex flex-col gap-5 items-center justify-center w-full h-[250px] rounded-lg bg-zinc-950 p-4'>
                        <p className=' text-xl font-semibold'>Maintenance Fullgame</p>
                      <Switch
                     checked={value}
                     onCheckedChange={handleSwitchChange}
                      />

                      {/* <button onClick={}>OnOff</button> */}
                      {/* <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={value} onChange={(e) => setValue(e.target.checked)} className="sr-only peer"/>
                        <div className="group peer ring-0 bg-rose-400  rounded-full outline-none duration-300 after:duration-300 w-24 h-12  shadow-md peer-checked:bg-emerald-500  peer-focus:outline-none  after:content-['✖️']  after:rounded-full after:absolute after:bg-gray-50 after:outline-none after:h-10 after:w-10 after:top-1 after:left-1 after:-rotate-180 after:flex after:justify-center after:items-center peer-checked:after:translate-x-12 peer-checked:after:content-['✔️'] peer-hover:after:scale-95 peer-checked:after:rotate-0">
                        </div>
                      </label> */}
{/* 
                        <input
                        type="checkbox"
                        role="switch"
                        checked={isOn}
                        onClick={handleSwitchChange}
                        /> */}


                       
                    </div>

                 
                </div>           

               </div>

           </div>
        </main>
      

    </div>
  )
}
