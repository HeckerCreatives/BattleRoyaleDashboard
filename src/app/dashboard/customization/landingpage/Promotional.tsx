'use client'
import { Eye, Plus, Trash2 } from 'lucide-react'
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { toast } from '@/components/ui/use-toast';
  

export default function Promotional() {
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
  
    const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && file.type.startsWith("video/")) { // Check if file is a video
        setVideoFile(file);
        setPreviewUrl(URL.createObjectURL(file));
      } else {
        toast({
            variant: 'destructive',
            description: 'Please select a video',
            duration: 200,
          });
      }
    };


  return (
    <div className=' w-full flex flex-col gap-4 '>
       <div className=' w-full grid grid-cols-1 md:grid-cols-2 gap-12 text-xs'>
            <div className=' w-full flex flex-col gap-4 '>
                <label htmlFor="">Title</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder='Title' className=' p-4 bg-zinc-800 rounded-md'/>
                <label htmlFor="">Content</label>
                <textarea  value={content} onChange={(e) => setContent(e.target.value)} placeholder='Content' className=' h-[300px] p-4 bg-zinc-800 rounded-md'/>

            </div>

            <div className=' w-full flex flex-col items-center gap-4 '>
                <label htmlFor="">Video</label>

                <div className=' flex items-center justify-center w-full aspect-video bg-zinc-800'>
                    {previewUrl ? (
                    <video
                        src={previewUrl}
                        controls
                        className="w-full h-full object-cover"
                    />
                    ) : (
                    <p className="text-gray-500 text-center">No video selected</p>
                    )}
                </div>

                <input accept="video/*" type="file" src="" alt="" onChange={handleVideoUpload} />

                <div className=' w-full flex items-end justify-end gap-4 text-xs'>
                    <button className=' bg-orange-600 text-white px-4 py-2 rounded-md'>Save</button>
                    <Dialog>
                    <DialogTrigger>
                        <button className=' bg-zinc-700 text-white px-4 py-2 rounded-md flex items-center gap-2'><Eye size={15}/>Preview</button>
                    </DialogTrigger>
                    <DialogContent className=' w-[90%] h-full bg-zinc-900 border-none overflow-hidden'
                    style={{backgroundImage: "url('/news/BG.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat:"no-repeat"}}
                    >
                    <div className='relative w-full h-auto flex lg:flex-row flex-col items-center justify-center gap-5'>
                        <div className=' w-full aspect-video border-orange-300 border-4 rounded-md flex items-center justify-center'
                        style={{backgroundImage: "url('/header/assets/BG A.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat:"no-repeat"}}
                        
                        >
                        
                        <Dialog>
                        <DialogTrigger>
                        <button className=''>
                            <img src="/news/Play Button.png" alt="" className=' hover:scale-110 ease-in-out duration-300' />
                        </button>
                        </DialogTrigger>
                        <DialogContent className=' text-white w-[90%] lg:w-[800px] aspect-video p-4 bg-zinc-950 border-zinc-900 flex flex-col items-center justify-center gap-4'
                        style={{backgroundImage: "url('/news/Tab Big.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat:"no-repeat"}}
                        
                        >
                        {/* <iframe className=' z-50 w-full aspect-video' src="https://www.youtube.com/embed/He-jKBESg9I?si=hDspTGvkSUsfHzss" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe> */}

                            {previewUrl ? (
                            <video
                                src={previewUrl}
                                controls
                                className="w-full h-full object-cover"
                            />
                            ) : (
                            <p className="text-gray-500 text-center">No video selected</p>
                            )}
                        </DialogContent>
                        </Dialog>


                        </div>

                        <div className=' h-[300px] lg:min-h-[500px] w-full  lg:w-[50%] border-orange-300 border-spacing-4 rounded-md p-4 md:p-10 flex flex-col gap-4 overflow-y-auto'
                        style={{backgroundImage: "url('/news/desc.png')", backgroundSize: "cover", backgroundPosition: "top", backgroundRepeat:"no-repeat"}}
                        >
                            <h2 className=' text-2xl lg:text-4xl font-bold text-amber-950'>{title}</h2>
                            <p className=' text-sm md:text-lg text-amber-900'>{content}</p>

                        </div>
                    </div>
                    </DialogContent>
                    </Dialog>

                </div>

            

            </div>

            </div>


    </div>
  )
}
