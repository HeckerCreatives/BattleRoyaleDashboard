import { Contact, Eye } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import axios, { AxiosError } from 'axios'
import { toast } from '@/components/ui/use-toast'
import { FiCheck } from 'react-icons/fi'
import { useRouter } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type Content = {
    title: string
    content: string
}
export default function Headercontent() {
    const [header, setHeader] = useState('')
    const [content, setContent] = useState('')
    const [selectedOption, setSelectedOption] = useState('');
    const [count, setCount] = useState(0); 
    const router = useRouter();
    const [type, setType] = useState('')
    const [contentdata, setContentData] = useState<Content[]>([])

    const fetchContent = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/content/getcontent?limit=10&type=${type}`, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log(response.data)
            setContentData(response.data.data)
            setHeader(response.data.data[0].title)
            setContent(response.data.data[0].description)
            
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError<{ message: string, data: string }>;
                if (axiosError.response && axiosError.response.status === 401) {
                    router.push('/');
                    toast({
                        variant: "destructive",
                        title: `${axiosError.response.data.message}`,
                        description: `${axiosError.response.data.data}`
                    });
                } else if (axiosError.response && axiosError.response.status === 400) {
                    toast({
                        variant: "destructive",
                        title: `${axiosError.response.data.message}`,
                        description: `${axiosError.response.data.data}`
                    });
                }
            }
        }
    };


    const handleCreateHeaderContent = async () => {

        if(header !== "" || content !== "" || selectedOption !== ''){
            try {
                const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/content/createcontent`,
                     {
                        title: header,
                        description: content,
                        link: "",
                        type: type
                     }, 
                     {                
                        withCredentials: true,
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            }
                     })
                     if ( response.data.message === 'success'){
                        fetchContent()
                        setHeader("")
                        setSelectedOption("")
                        setContent("")
                           toast({
                            description:(<div className=' flex items-center gap-2'><FiCheck size={20} /><p>News successfully created</p></div>)
                            })
                    }
    
                     if ( response.data.message === 'failed'){
                          setHeader("")
                          setContent("")
                          setSelectedOption("")
                          toast({
                            variant:'destructive',
                            description:(<div className=' flex items-center gap-2'><FiCheck size={20} /><p>{response.data.data}</p></div>)
                            })
                    }
                    if ( response.data.message === 'bad-request'){
                          setHeader("")
                          setContent("")
                          setSelectedOption("")
                          toast({
                            variant:'destructive',
                            description:(<div className=' flex items-center gap-2'><FiCheck size={20} /><p>{response.data.data}</p></div>)
                            })
                    }
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
      }


      useEffect(()=> {
        setCount(content.length)
      }, [content])

      useEffect(() => {
        const fetchContent = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/content/getcontent?limit=10&type=${type}`, {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                console.log(response.data)
                setContentData(response.data.data)
                setHeader(response.data.data[0].title)
                setContent(response.data.data[0].description)
                
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    const axiosError = error as AxiosError<{ message: string, data: string }>;
                    if (axiosError.response && axiosError.response.status === 401) {
                        router.push('/');
                        toast({
                            variant: "destructive",
                            title: `${axiosError.response.data.message}`,
                            description: `${axiosError.response.data.data}`
                        });
                    } else if (axiosError.response && axiosError.response.status === 400) {
                        toast({
                            variant: "destructive",
                            title: `${axiosError.response.data.message}`,
                            description: `${axiosError.response.data.data}`
                        });
                    }
                }
            }
        };
    
        fetchContent();
    }, [type]);


  return (
    
    <div className=' w-full flex flex-col gap-4 text-xs'>
         <label htmlFor="">Type</label>
          <Select 
         value={type}
         onValueChange={setType}
          >
            <SelectTrigger className='w-full bg-zinc-900 rounded-md'>
                <SelectValue placeholder="Select Type"/>
            </SelectTrigger>
            <SelectContent>
            <SelectItem value='header'>Header</SelectItem>
            <SelectItem value='about'>About</SelectItem>
            </SelectContent>
          </Select>
         <label htmlFor="">Title </label>
         <input value={header} onChange={(e) => setHeader(e.target.value)} placeholder='Title' className=' p-4 bg-zinc-800 rounded-md'/>
        <label htmlFor=""> Content</label>
        <textarea value={content} maxLength={500} onChange={(e) =>setContent(e.target.value)} placeholder='Input content here' className=' h-[350px] p-4 bg-zinc-800 rounded-md'/>
        <div className="text-right text-gray-400">
            {count} / {500} characters
        </div>
        <div className=' w-full flex items-end justify-end gap-4 text-xs'>
            <button onClick={handleCreateHeaderContent} className=' bg-orange-600 text-white px-4 py-2 rounded-md'>Save</button>
            <Dialog>
            <DialogTrigger>
                <button className=' bg-zinc-700 text-white px-4 py-2 rounded-md flex items-center gap-2'><Eye size={15}/>Preview</button>
            </DialogTrigger>
            <DialogContent className=' w-[90%] h-full bg-zinc-900 border-none overflow-hidden flex items-center justify-center'>
            <div className=' relative z-10 flex flex-col items-center w-[98%] h-[100dvh] max-h-[1080px] px-4'
                style={{ backgroundImage: "url('/hero.png')" , backgroundSize:'cover', backgroundRepeat:'no-repeat', backgroundPosition:'center',}}>
                <div className=' w-full h-full bg-gradient-to-b from-zinc-950 to-zinc-950/0 absolute'>

                </div>


                <div className=' relative z-10 w-full h-full flex flex-col items-start justify-start '>
                    <div className=' w-full flex flex-col gap-8 items-center justify-center mt-32'>
                    <h1 
                    className=' lg:text-5xl text-3xl font-bold text-center max-w-[800px] text-white'>{header}</h1>
                    <p 
                   
                    className=' lg:text-lg text-sm text-center max-w-[800px] text-amber-50'>{content}</p>

                    </div>
                    <div 
                    className=' w-full flex justify-center items-center gap-2 absolute bottom-16 '>
                        <a href="/download" className=' hover:scale-110 transition-all duration-300'>
                        <img src="/astore.png" alt="" width={150} className='~w-32/40 ' />
                        </a>

                        <a href="/download" className=' hover:scale-110 transition-all duration-300'>
                        <img src="/gp.png" alt="" width={150} className=' ~w-32/40' />

                        </a>

                    </div>
                    </div>
                </div>
            </DialogContent>
            </Dialog>


        </div>

    </div>
  )
}


