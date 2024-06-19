"use client"
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import React, { useEffect, useState } from 'react'
import { BsPersonPlusFill } from 'react-icons/bs'
import { FaUsers } from 'react-icons/fa'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { IoMdDownload } from "react-icons/io";
import { useToast } from "@/components/ui/use-toast"
import axios, {AxiosError} from 'axios'
import { useRouter } from 'next/navigation'

const data = [
  {
    name: 'Data 1',
    uv: 4000,
    transaction:0,
    amt: 2400,
  },
  {
    name: 'Data 2',
    uv: 3000,
    transaction:0,
    amt: 2210,
  },
  {
    name: 'Data 3',
    uv: 2000,
    transaction:0,
    amt: 2290,
  },
  {
    name: 'Data 4',
    uv: 2780,
    transaction:0,
    amt: 2000,
  },
  {
    name: 'Data 5',
    uv: 1890,
    transaction:0,
    amt: 2181,
  },
  {
    name: 'Data 6',
    uv: 2390,
    transaction:0,
    amt: 2500,
  },
  {
    name: 'Data 7',
    uv: 3490,
    transaction:0,
    amt: 2100,
  },
];

const data2 = [
  {
    name: 'Data 1',
    uv: 4000,
    registration: 2400,
    amt: 2400,
  },
  {
    name: 'Data 2',
    uv: 3000,
    registration: 1398,
    amt: 2210,
  },
  {
    name: 'Data 3',
    uv: 2000,
    registration: 9800,
    amt: 2290,
  },
  {
    name: 'Data 4',
    uv: 2780,
    registration: 3908,
    amt: 2000,
  },
  {
    name: 'Data 5',
    uv: 1890,
    registration: 4800,
    amt: 2181,
  },
  {
    name: 'Data 6',
    uv: 2390,
    registration: 3800,
    amt: 2500,
  },
  {
    name: 'Data 7',
    uv: 3490,
    registration: 4300,
    amt: 2100,
  },
];


export default function Dashboard() {
  const [tab, setTab] = useState('registration')
  const [ chart, setChart] = useState('daily')
  const { toast } = useToast()
  const router = useRouter()
  const [total, setTotal] = useState(0)
  const [today, setToday] = useState(0)
  const [chartData, setChartData] = useState('daily')
  const [timeData, setTimeData] = useState<{ time: string, value: number }[]>([]);

  useEffect(() => {
    const getCountregister = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/getregistrationcount`,{
           withCredentials: true,
              headers: {
              'Content-Type': 'application/json',
                }
        })
        setTotal(response.data.data.totalusers)
        setToday(response.data.data.usersToday)
        console.log(response.data)
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
    getCountregister()
  },[])

   useEffect(() => {
    const getCountregister = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/getuserregistrationchart`,{
          params:{
            charttype: chart
          },
           withCredentials: true,
              headers: {
              'Content-Type': 'application/json',
                }
        })
       const data = response.data.data;

        // Transform the data
        const transformedData = Object.entries(data).map(([time, value]) => ({
          time,
          value: Number(value)
        }));
        console.log('Transformed data:', transformedData); // Log transformed data
        setTimeData(transformedData);
        console.log(response.data)
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
    getCountregister()
  },[chart])

  return (
     <div className=' flex w-full h-full'>
        <Sidebar/>
        <main className=' bg-zinc-900 w-full text-white'
        style={{backgroundImage: "url('/dashboard/assets/BG.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat:"no-repeat"}}
        
        >
            <Header/>

            <div className=' flex flex-col gap-4 w-full rounded-lg p-4 md:p-10'> 

             <div className=' relative w-full h-[180px] rounded-lg flex items-end justify-between p-6 shadow-lg border-[1px] border-opacity-50 border-orange-300'
                style={{backgroundImage: "url('/dashboard/assets/Tab.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat:"no-repeat"}}
                >
                    {/* <div className=' absolute top-0 left-0 w-full h-full bg-gradient-to-r from-[#000000] to-[#00000000] rounded-lg'>

                    </div> */}
                    <h2 className=' relative z-10 text-2xl font-bold text-secondary'>Dashboard</h2>

                    <div className=' hidden md:flex flex-col items-center justify-center gap-2 h-full w-[180px] bg-zinc-950 rounded-md'>
                      <IoMdDownload size={30} className=' text-secondary'/>
                      <h2 className=' text-lg font-bold'>0</h2>
                      <p className=' text-xs text-zinc-300'>Total Downloads</p>
                    </div>

              </div>     

              <div className=' relative flex items-center'>
                 <p onClick={() => setTab('registration')} className={` relative text-sm font-medium py-2 px-4 cursor-pointer ${ tab === 'registration' && ' border-b-2 border-secondary'}`}>Registration</p>
                <p onClick={() => setTab('transaction')} className={` relative text-sm font-medium py-2 px-4 cursor-pointer ${ tab === 'transaction' && ' border-b-2 border-secondary'}`}>Transaction</p>

               

              </div>

              { tab === 'transaction' && (
                <>
                 <div className=' grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 xl:grid-cols-3 gap-4 mt-4'>

                    <div className=' flex items-center gap-5 w-full h-[150px] rounded-lg bg-zinc-950 p-4'
                    style={{backgroundImage: "url('/dashboard/assets/TAB A.png')", backgroundSize: "cover", backgroundPosition: "left", backgroundRepeat:"no-repeat"}}
                    
                    >
                        {/* <BsPersonPlusFill size={30} className=' text-secondary'/> */}
                        <div className=' w-[60%] lg:w-[70%]'>

                        </div>

                        <div className=' flex flex-col h-full w-full gap-2 items-center justify-center p-2'>
                            <p className=' text-2xl lg:text-4xl font-bold text-amber-950'>0</p>
                            <p className=' text-xs lg:text-sm font-semibold text-amber-900'>Total Transaction</p>

                        </div>
                    </div>

                    <div className=' flex items-center gap-5 w-full h-[150px] rounded-lg bg-zinc-950 p-4'
                    style={{backgroundImage: "url('/dashboard/assets/TAB A.png')", backgroundSize: "cover", backgroundPosition: "left", backgroundRepeat:"no-repeat"}}
                    
                    >
                        <div className=' w-[60%] lg:w-[70%]'>

                        </div>

                        <div className=' flex flex-col w-full gap-2 items-center justify-center p-2'>
                            <p className=' text-2xl lg:text-4xl font-semibold text-amber-950'>0</p>
                            <p className=' text-xs lg:text-sm text-amber-900'>Todays Transactions</p>

                        </div>
                    </div>

                </div>

                <div className=' flex flex-col items-center justify-center gap-6 w-full h-auto rounded-lg bg-[#000000] p-2 md:p-10 border-2 border-orange-300 border-opacity-50'>
                    <div className=' flex items-center'>
                        <p onClick={() => setChart('daily')} className={` text-sm font-medium px-4 py-2 cursor-pointer ${chart === 'daily' && ' border-b-2 border-secondary'}`}>Daily</p>
                        <p onClick={() => setChart('weekly')} className={` text-sm font-medium px-4 py-2 cursor-pointer ${chart === 'weekly' && ' border-b-2 border-secondary'}`}>Weekly</p>
                        <p onClick={() => setChart('monthly')} className={` text-sm font-medium px-4 py-2 cursor-pointer ${chart === 'monthly' && ' border-b-2 border-secondary'}`}>Monthly</p>
                        <p onClick={() => setChart('yearly')} className={` text-sm font-medium px-4 py-2 cursor-pointer ${chart === 'yearly' && ' border-b-2 border-secondary'}`}>Yearly</p>
                    </div>
                    <ResponsiveContainer width="100%" height={400}>
                         <LineChart width={730} height={350} data={data}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" className=' text-xs'/>
                        <YAxis className=' text-xs' />
                        <Tooltip/>
                        <Legend />
                        <Line type="monotone" dataKey="transaction" stroke="#FF7A2C" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                   
                </div>
                </>
              )}

               { tab === 'registration' && (
                <>
                <div className=' grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 xl:grid-cols-3 gap-4 mt-4'>

                    <div className=' flex items-center gap-5 w-full h-[150px] rounded-lg'
                    style={{backgroundImage: "url('/dashboard/assets/TAB A.png')", backgroundSize: "cover", backgroundPosition: "left", backgroundRepeat:"no-repeat"}}
                    
                    >
                        {/* <BsPersonPlusFill size={30} className=' text-secondary'/> */}
                        <div className=' w-[60%] lg:w-[70%]'>

                        </div>

                        <div className=' flex flex-col h-full w-full gap-2 items-center justify-center p-2'>
                            <p className=' text-2xl lg:text-4xl font-bold text-amber-950'>{total}</p>
                            <p className=' text-xs lg:text-sm font-semibold text-amber-900'>Total Registrations</p>

                        </div>
                    </div>

                    <div className=' flex items-center gap-5 w-full h-[150px] rounded-lg bg-zinc-950'
                    style={{backgroundImage: "url('/dashboard/assets/TAB A.png')", backgroundSize: "cover", backgroundPosition: "left", backgroundRepeat:"no-repeat"}}
                    
                    >
                        <div className='w-[60%] lg:w-[70%]'>

                        </div>

                        <div className=' flex flex-col w-full gap-2 items-center justify-center p-2'>
                            <p className=' text-2xl lg:text-4xl font-semibold text-amber-950'>{today}</p>
                            <p className=' text-xs lg:text-sm text-amber-900'>Todays Registrations</p>

                        </div>
                    </div>

                </div>

                <div className=' flex flex-col items-center justify-center gap-6 w-full h-auto rounded-lg bg-[#000000] p-2 md:p-10 border-2 border-orange-300 border-opacity-50'>
                    <div className=' flex items-center'>
                        <p onClick={() => setChart('daily')} className={` text-sm font-medium px-4 py-2 cursor-pointer ${chart === 'daily' && ' border-b-2 border-secondary'}`}>Daily</p>
                        <p onClick={() => setChart('weekly')} className={` text-sm font-medium px-4 py-2 cursor-pointer ${chart === 'weekly' && ' border-b-2 border-secondary'}`}>Weekly</p>
                        <p onClick={() => setChart('monthly')} className={` text-sm font-medium px-4 py-2 cursor-pointer ${chart === 'monthly' && ' border-b-2 border-secondary'}`}>Monthly</p>
                        <p onClick={() => setChart('yearly')} className={` text-sm font-medium px-4 py-2 cursor-pointer ${chart === 'yearly' && ' border-b-2 border-secondary'}`}>Yearly</p>
                    </div>
                    <ResponsiveContainer width="100%" height={400}>
                         <LineChart width={730} height={350} data={timeData}
                        margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" className=' text-xs'/>
                        <YAxis className=' text-xs'/>
                        <Tooltip/>
                        <Legend/>
                        <Line type="monotone" dataKey="value" stroke="#FF7A2C" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                   
                </div>
                </>
              )}
            

            </div>
             
        </main>
      

    </div>
  )
}
