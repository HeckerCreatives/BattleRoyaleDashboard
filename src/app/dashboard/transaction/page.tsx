"use client"

import Sidebar from '@/components/Sidebar'
import React, { useState } from 'react'
import Header from '@/components/Header'




export default function page() {
    const [tab, setTab] = useState('topup')

  return (
    <div className=' flex w-full h-screen'>
        <Sidebar/>
        <main className=' bg-zinc-900 w-full text-white'>
           <Header/>

           <div className=' w-full h-[500px] flex flex-col items-center p-4 md:p-10'>
              <div className=' relative w-full h-[180px] bg-red-500 rounded-lg flex items-end p-6 shadow-lg'
                style={{backgroundImage: "url('/maintenance.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat:"no-repeat"}}
                >
                    <div className=' absolute top-0 left-0 w-full h-full bg-gradient-to-r from-[#000000] to-[#00000000] rounded-lg'>

                    </div>
                    <h2 className=' relative z-10 text-2xl font-bold text-secondary'>Transactions</h2>

              </div>     
            <p className=' text-sm text-zinc-300 mt-40'>Coming Soon!</p>

           </div>
             
        </main>
      

    </div>
  )
}
