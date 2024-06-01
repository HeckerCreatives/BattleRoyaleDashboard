"use client"
import Header from '@/components/Header'
import HeaderAdmin from '@/components/HeaderAdmin'
import Sidebar from '@/components/Sidebar'
import SidebarAdmin from '@/components/SidebarAdmin'
import React from 'react'


export default function Dashboard() {
  return (
     <div className=' flex w-full h-full'>
        <SidebarAdmin/>
        <main className=' bg-zinc-900 w-full text-white'>
            <HeaderAdmin/>

            <div className=' flex flex-col  w-full p-8'>
                <p className=' text-lg font-semibold py-4'>Dashboard</p>
              <div className=' flex flex-col gap-4 items-center justify-end w-full h-[600px] rounded p-4 bg-zinc-950 border-none sm:p-6'
              style={{backgroundImage: "url('/header BG.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat:"no-repeat"}}
              >
                
                
              </div>
            </div>
             
        </main>
      

    </div>
  )
}
