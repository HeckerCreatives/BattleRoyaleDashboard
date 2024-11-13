import { Eye } from 'lucide-react'
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"

type Header = {
    title: string
    content: string
}
export default function Headercontent() {
    const [header, setHeader] = useState('LOREM IPSUM')
    const [content, setContent] = useState('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.')
    
  return (
    <div className=' w-full flex flex-col gap-4 text-xs'>
         <label htmlFor="">Title </label>
         <input value={header} onChange={(e) => setHeader(e.target.value)} placeholder='Title' className=' p-4 bg-zinc-800 rounded-md'/>
        <label htmlFor=""> Content</label>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder='Input content here' className=' h-[350px] p-4 bg-zinc-800 rounded-md'/>

        <div className=' w-full flex items-end justify-end gap-4 text-xs'>
            <button className=' bg-orange-600 text-white px-4 py-2 rounded-md'>Save</button>
            <Dialog>
            <DialogTrigger>
                <button className=' bg-zinc-700 text-white px-4 py-2 rounded-md flex items-center gap-2'><Eye size={15}/>Preview</button>
            </DialogTrigger>
            <DialogContent className=' w-[90%] h-full bg-zinc-900 border-none overflow-hidden'>
            <div className=' w-full h-[90%] flex flex-col items-center justify-end text-white'
                style={{backgroundImage: "url('/header/assets/BG B.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat:"no-repeat"}}
                >
              
                    <div className=' hidden fixed right-0 z-50  bottom-8 lg:flex flex-col items-center justify-center gap-2 rounded-l-lg bg-amber-900 2xl:w-20 xl:w-16 lg:w-14 py-6'>
                    
                    <a href='https://web.facebook.com/'>
                        <img src="/header/assets/FB.png" alt=""  width={70} className=' 2xl:w-[60px] xl:w-[40px] lg:[40px] hover:scale-110 ease-in-out duration-300'/>

                    </a>

                    <a href='https://discord.com/'>
                    <img src="/header/assets/Discord.png" alt="" width={70} className=' 2xl:w-[60px] xl:w-[40px] lg:[40px] hover:scale-110 ease-in-out duration-300' />

                    </a>

                    <a href='https://www.tiktok.com/'>
                    <img src="/header/assets/Tiktok.png" alt="" width={70} className=' 2xl:w-[60px] xl:w-[40px] lg:[40px] hover:scale-110 ease-in-out duration-300' />

                    </a>

                    <a href='https://web.telegram.org/'>
                    <img src="/header/assets/Telegram.png" alt="" width={70} className=' 2xl:w-[60px] xl:w-[40px] lg:[40px] hover:scale-110 ease-in-out duration-300' />

                    </a>

                    </div>

                    <div className='relative z-0 max-w-[1920px] w-[90%] lg:w-[78%] h-[90%] flex items-end justify-end py-20'>
                    <img src="/header/assets/Character.png" alt="" width={520} className=' lg:w-[280px] xl:w-[290px] 2xl:w-[380px] absolute right-0 bottom-0 z-20 lg:block hidden' />

                    <div className=' relative h-full grid grid-cols-1 lg:grid-cols-2 rounded-lg'
                    style={{backgroundImage: "url('/header/assets/BG A.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat:"no-repeat"}}
                    >
                    <div className=' relative z-20 flex flex-col justify-center md:p-14 p-8'>
                        <h2 className=' text-2xl 2xl:text-6xl font-bold'>{header}</h2>
                        <p className=' text-sm 2xl:text-lg text-orange-100 font-semibold mt-4'>{content}</p>

                      

                        <div className=' flex justify-center items-center gap-2 mt-6'>
                        <a href="/download">
                        <img src="/astore.png" alt="" width={200} className=' 2xl:w-[200px] w-[120px]' />
                        </a>

                        <a href="/download">
                        <img src="/gp.png" alt="" width={200} className=' 2xl:w-[200px] w-[120px]' />

                        </a>

                        </div>
                    </div>

                   

                    </div>
                    </div>

                 

                </div>
            </DialogContent>
            </Dialog>


        </div>

    </div>
  )
}


