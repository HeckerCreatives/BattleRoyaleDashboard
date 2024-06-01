"use client"
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import React, { useState } from 'react'
import { BsPersonPlusFill } from 'react-icons/bs'
import { FaUsers } from 'react-icons/fa'


export default function Dashboard() {
  const [tab, setTab] = useState('transaction')

  return (
     <div className=' flex w-full h-full'>
        <Sidebar/>
        <main className=' bg-zinc-900 w-full text-white'>
            <Header/>

            <div className=' flex flex-col gap-4 w-full rounded-lg p-10'> 

              <div className=' relative flex items-center'>
                <p onClick={() => setTab('transaction')} className={` relative mt-4 text-sm font-semibold py-2 px-4 cursor-default ${ tab === 'transaction' && ' border-b-2 border-secondary'}`}>Transaction</p>

                <p onClick={() => setTab('registration')} className={` relative mt-4 text-sm font-semibold py-2 px-4 cursor-default ${ tab === 'registration' && ' border-b-2 border-secondary'}`}>Registration</p>

              </div>
              
                <div className=' grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 mt-4'>

                    <div className=' flex flex-col gap-5 items-center justify-center w-full h-[180px] rounded-lg bg-zinc-950 p-4'>
                        <BsPersonPlusFill size={30} className=' text-secondary'/>

                        <div className=' flex flex-col gap-2 items-center p-2'>
                            <p className=' text-xl font-semibold'>12,967</p>
                            <p className=' text-xs text-zinc-200'>Total Joinings</p>

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
                            <p className=' text-xs text-zinc-200'>Todays Joinings</p>

                        </div>
                    </div>

                </div>

                <div className=' w-full h-[300px] rounded-lg bg-zinc-950'>

                </div>
            </div>
             
        </main>
      

    </div>
  )
}
