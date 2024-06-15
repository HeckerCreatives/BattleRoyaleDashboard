"use client"

import Sidebar from '@/components/Sidebar'
import React, { useState } from 'react'
import Header from '@/components/Header'




export default function page() {
    const [tab, setTab] = useState('topup')

  return (
    <div className=' flex w-full h-screen'>
        <Sidebar/>
        <main className=' bg-zinc-900 w-full text-white'
        style={{backgroundImage: "url('/dashboard/assets/BG.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat:"no-repeat"}}
        
        >
           <Header/>

           <div className=' w-full h-[500px] flex flex-col items-center p-4 md:p-10'>
              <div className=' relative w-full h-[180px] rounded-lg flex items-end p-6 shadow-lg border-[1px] border-opacity-50 border-orange-300'
                style={{backgroundImage: "url('/dashboard/assets/Tab.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat:"no-repeat"}}
                
                >
                    <div className=' absolute top-0 left-0 w-full h-full bg-gradient-to-r from-[#000000] to-[#00000000] rounded-lg'>

                    </div>
                    <h2 className=' relative z-10 text-2xl font-bold text-secondary'>Transactions</h2>

              </div>

              <div className=' flex items-center justify-center w-full h-full mt-10 bg-zinc-950 border-[1px] border-opacity-30 border-orange-300 rounded-lg'>
                <p className=' text-sm text-zinc-300'>Coming Soon!</p>

              </div>     

           </div>
             
        </main>
      

    </div>
  )
}
