"use client"
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import React, { useState } from 'react'
import { BsPersonPlusFill } from 'react-icons/bs'
import { FaUsers } from 'react-icons/fa'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { IoMdDownload } from "react-icons/io";

const data = [
  {
    name: 'Day 1',
    uv: 4000,
    transaction: 2400,
    amt: 2400,
  },
  {
    name: 'Day 2',
    uv: 3000,
    transaction: 1398,
    amt: 2210,
  },
  {
    name: 'Day 3',
    uv: 2000,
    transaction: 9800,
    amt: 2290,
  },
  {
    name: 'Day 4',
    uv: 2780,
    transaction: 3908,
    amt: 2000,
  },
  {
    name: 'Day 5',
    uv: 1890,
    transaction: 4800,
    amt: 2181,
  },
  {
    name: 'Day 6',
    uv: 2390,
    transaction: 3800,
    amt: 2500,
  },
  {
    name: 'Day 7',
    uv: 3490,
    transaction: 4300,
    amt: 2100,
  },
];

const data2 = [
  {
    name: 'Day 1',
    uv: 4000,
    registration: 2400,
    amt: 2400,
  },
  {
    name: 'Day 2',
    uv: 3000,
    registration: 1398,
    amt: 2210,
  },
  {
    name: 'Day 3',
    uv: 2000,
    registration: 9800,
    amt: 2290,
  },
  {
    name: 'Day 4',
    uv: 2780,
    registration: 3908,
    amt: 2000,
  },
  {
    name: 'Day 5',
    uv: 1890,
    registration: 4800,
    amt: 2181,
  },
  {
    name: 'Day 6',
    uv: 2390,
    registration: 3800,
    amt: 2500,
  },
  {
    name: 'Day 7',
    uv: 3490,
    registration: 4300,
    amt: 2100,
  },
];


export default function Dashboard() {
  const [tab, setTab] = useState('transaction')
  const [ chart, setChart] = useState('daily')

  return (
     <div className=' flex w-full h-full'>
        <Sidebar/>
        <main className=' bg-zinc-900 w-full text-white'>
            <Header/>

            <div className=' flex flex-col gap-4 w-full rounded-lg p-4 md:p-10'> 

             <div className=' relative w-full h-[180px] rounded-lg flex items-end justify-between p-6 shadow-lg'
                style={{backgroundImage: "url('/maintenance.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat:"no-repeat"}}
                >
                    <div className=' absolute top-0 left-0 w-full h-full bg-gradient-to-r from-[#000000] to-[#00000000] rounded-lg'>

                    </div>
                    <h2 className=' relative z-10 text-2xl font-bold text-secondary'>Dashboard</h2>

                    <div className=' hidden md:flex flex-col items-center justify-center gap-2 h-full w-[180px] bg-zinc-950 rounded-md'>
                      <IoMdDownload size={30} className=' text-secondary'/>
                      <h2 className=' text-lg font-bold'>1,286</h2>
                      <p className=' text-xs text-zinc-300'>Total Downloads</p>
                    </div>

              </div>     

              <div className=' relative flex items-center'>
                <p onClick={() => setTab('transaction')} className={` relative text-sm font-medium py-2 px-4 cursor-default ${ tab === 'transaction' && ' border-b-2 border-secondary'}`}>Transaction</p>

                <p onClick={() => setTab('registration')} className={` relative text-sm font-medium py-2 px-4 cursor-default ${ tab === 'registration' && ' border-b-2 border-secondary'}`}>Registration</p>

              </div>

              { tab === 'transaction' && (
                <>
                <div className=' grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 mt-4'>

                    <div className=' flex flex-col gap-5 items-center justify-center w-full h-[180px] rounded-lg bg-zinc-950 p-4'>
                        <BsPersonPlusFill size={30} className=' text-secondary'/>

                        <div className=' flex flex-col gap-2 items-center p-2'>
                            <p className=' text-xl font-semibold'>12,967</p>
                            <p className=' text-xs text-zinc-200'>Total Transactions</p>

                        </div>
                    </div>

                    <div className=' flex flex-col gap-5 items-center justify-center w-full h-[180px] rounded-lg bg-zinc-950 p-4'>
                        <FaUsers size={30} className=' text-secondary'/>
                        {/* <lord-icon
                            src="https://cdn.lordicon.com/hrjifpbq.json"
                            trigger="hover"
                            style="width:250px;height:250px">
                        </lord-icon> */}

                        <div className=' flex flex-col gap-2 items-center p-2'>
                            <p className=' text-xl font-semibold'>1,478</p>
                            <p className=' text-xs text-zinc-200'>Todays Transactions</p>

                        </div>
                    </div>

                </div>

                <div className=' flex flex-col items-center justify-center gap-6 w-full h-auto rounded-lg bg-zinc-950 p-2 md:p-10'>
                    <div className=' flex items-center'>
                        <p onClick={() => setChart('daily')} className={` text-sm font-medium px-4 py-2 cursor-default ${chart === 'daily' && ' border-b-2 border-secondary'}`}>Daily</p>
                        <p onClick={() => setChart('weekly')} className={` text-sm font-medium px-4 py-2 cursor-default ${chart === 'weekly' && ' border-b-2 border-secondary'}`}>Weekly</p>
                        <p onClick={() => setChart('monthly')} className={` text-sm font-medium px-4 py-2 cursor-default ${chart === 'monthly' && ' border-b-2 border-secondary'}`}>Monthly</p>
                        <p onClick={() => setChart('yearly')} className={` text-sm font-medium px-4 py-2 cursor-default ${chart === 'yearly' && ' border-b-2 border-secondary'}`}>Yearly</p>
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
                <div className=' grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 mt-4'>

                    <div className=' flex flex-col gap-5 items-center justify-center w-full h-[180px] rounded-lg bg-zinc-950 p-4'>
                        <BsPersonPlusFill size={30} className=' text-secondary'/>

                        <div className=' flex flex-col gap-2 items-center p-2'>
                            <p className=' text-xl font-semibold'>12,967</p>
                            <p className=' text-xs text-zinc-200'>Total Registrations</p>

                        </div>
                    </div>

                    <div className=' flex flex-col gap-5 items-center justify-center w-full h-[180px] rounded-lg bg-zinc-950 p-4'>
                        <FaUsers size={30} className=' text-secondary'/>
                        {/* <lord-icon
                            src="https://cdn.lordicon.com/hrjifpbq.json"
                            trigger="hover"
                            style="width:250px;height:250px">
                        </lord-icon> */}

                        <div className=' flex flex-col gap-2 items-center p-2'>
                            <p className=' text-xl font-semibold'>1,478</p>
                            <p className=' text-xs text-zinc-200'>Todays Registrations</p>

                        </div>
                    </div>

                </div>

                <div className=' flex flex-col items-center justify-center gap-6 w-full h-auto rounded-lg bg-zinc-950 p-2 md:p-10'>
                    <div className=' flex items-center'>
                        <p onClick={() => setChart('daily')} className={` text-sm font-medium px-4 py-2 cursor-default ${chart === 'daily' && ' border-b-2 border-secondary'}`}>Daily</p>
                        <p onClick={() => setChart('weekly')} className={` text-sm font-medium px-4 py-2 cursor-default ${chart === 'weekly' && ' border-b-2 border-secondary'}`}>Weekly</p>
                        <p onClick={() => setChart('monthly')} className={` text-sm font-medium px-4 py-2 cursor-default ${chart === 'monthly' && ' border-b-2 border-secondary'}`}>Monthly</p>
                        <p onClick={() => setChart('yearly')} className={` text-sm font-medium px-4 py-2 cursor-default ${chart === 'yearly' && ' border-b-2 border-secondary'}`}>Yearly</p>
                    </div>
                    <ResponsiveContainer width="100%" height={400}>
                         <LineChart width={730} height={350} data={data2}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" className=' text-xs'/>
                        <YAxis className=' text-xs'/>
                        <Tooltip/>
                        <Legend/>
                        <Line type="monotone" dataKey="registration" stroke="#FF7A2C" strokeWidth={2} />
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
