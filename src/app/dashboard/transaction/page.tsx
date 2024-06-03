"use client"

import Sidebar from '@/components/Sidebar'
import React, { useState } from 'react'
import Header from '@/components/Header'




export default function page() {
    const [tab, setTab] = useState('topup')

  return (
    <div className=' flex w-full h-full'>
        <Sidebar/>
        <main className=' bg-zinc-900 w-full text-white'>
           <Header/>

           <div className=' w-full h-[500px] flex items-center justify-center'>
            <p className=' text-sm text-zinc-300'>Coming Soon!</p>

           </div>
             
        </main>
      

    </div>
  )
}
