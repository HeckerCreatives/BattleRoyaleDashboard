"use client"
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import React from 'react'

export default function Dashboard({children}: {children: React.ReactNode}) {


  return (
     <div className=' flex w-full h-screen overflow-x-hidden'>
        <Sidebar/>
        <main className=' bg-zinc-900 w-full text-white overflow-y-auto'
        style={{backgroundImage: "url('/dashboard/assets/BG.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat:"no-repeat"}}
        
        >
            <Header/>
            {children}
             
        </main>
      

    </div>
  )
}
