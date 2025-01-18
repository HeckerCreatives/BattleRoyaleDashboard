"use client"
import React, { ChangeEvent, useEffect, useState } from 'react'
import Sidebar from '@/components/Sidebar'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Header from '@/components/Header'
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import axios, {AxiosError} from 'axios'
import { useRouter } from 'next/navigation'
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from 'react-icons/md'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { HiRefresh } from "react-icons/hi";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { IoMdEye } from "react-icons/io";
import { TiArrowLeftThick, TiArrowRightThick } from 'react-icons/ti'
import { RiCloseFill } from "react-icons/ri";
import { FiCheck } from "react-icons/fi";
import emailjs from "emailjs-com";
import Subcribers from './Subscribers'


interface News {
    banner: string
description: string
newsid: string
title: string

}

type Subscriber = {
    email: string
}
export default function page() {
    const [selectedImage, setSelectedImage] = useState<string | ArrayBuffer | null>(null);
    const { toast } = useToast()
    const router = useRouter()
    const [ title, setTitle] = useState('')
    const [ description, setDescription] = useState('')
    const [loading, setLoading] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [mass, setMass] = useState(false)
    const [subscription, setSubscription] = useState<Subscriber[]>([])

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setSelectedImage(reader.result);
        };
        reader.readAsDataURL(file);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFile(e.target.files[0]);
        }
    };

     useEffect(() => {
        if (selectedFile) {
        }
    }, [selectedFile]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleImageChange(e);
    handleFileChange(e);
  };

    const massNews = async () => {
        setLoading(true)
        if( title === ''){
        setLoading(false)
             toast({
            variant: "destructive",
            title: "Enter a news title",
            })
        }
        if( description === ''){
        setLoading(false)
             toast({
            variant: "destructive",
            title: "Enter a news description",
            })
        }

        if(title !== '' && description !== '' && mass === true){
            try {
                const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/inbox/newsmessage`,{
                    title: title,
                    description: description,
                    bannerimg: selectedFile
                },{
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                        }
                })
                if ( response.data.message === 'success'){
                    setLoading(false)
                    setTitle('')
                    setDescription('')
                    setSelectedImage(null)
                      toast({
                        title: "Success",
                        description:'News successfully created'
                        })
                }

                 if ( response.data.message === 'failed'){
                    setLoading(false)
                      toast({
                        title: "Failed",
                        description:`${response.data.data}`
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

    const handleNews = () => {
        createNews();
        massNews();
    };

    const [ news, setNews] = useState<News[]>([])
    const [ totalpages, setTotalPages] = useState(0)
    const [ listLoad, setListload] = useState(false)
    const [ currentpage, setCurrentpage] = useState<number>(0)
    const [ check, setCheck] = useState(false)
    const [ edit, setEdit] = useState(true)
    const [editTitle, setEditTitle] = useState('')
    const [editdescription, setEditDescription] = useState('')
    const [id, setId] = useState('')
    const [editload, setEditLoad] = useState(false)
    const [tab, setTab] = useState('tab1')

    {/*News List*/}
    useEffect(() =>{
        const news = async () => {
            setListload(true)
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/newsletter/getnewsletterlist?page=${currentpage}&limit=10`,{
                     withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                        }
                })
                setListload(false)
                setTotalPages(response.data.data.totalpages)
                setNews(response.data.data.news)
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
        news()
    },[currentpage])

    const refresh = async () => {
            setListload(true)
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/newsletter/getnewsletterlist?page=${currentpage}&limit=10`,{
                     withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                        }
                })
                setListload(false)
                setTotalPages(response.data.data.totalpages)
                setNews(response.data.data.news)
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

    const editNews = async () => {
        setEditLoad(true)
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/newsletter/editnewsletter`,{
                newsletterid: id,
                title: editTitle,
                description: editdescription,
                bannerimg: selectedFile
            },{
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    }
            })
        setEditLoad(false)
            if ( response.data.message === 'success') {
                setSelectedImage(null)
                setSelectedFile(null)
                 toast({
                description: (<div className=' flex items-center gap-2'><FiCheck size={20} /><p>Newsletter updated successfully</p></div>)
                })
            }

            if ( response.data.message === 'failed') {
                setSelectedImage(null)
                setSelectedFile(null)
                 toast({
                    variant:'destructive',
                description: (<div className=' flex items-center gap-2'><RiCloseFill size={20} /><p>{response.data.data}</p></div>)
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

    const deleteNews = async () =>{
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/newsletter/deletenewsletter?newsletterid=${id}`,{
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    }
            })
             if ( response.data.message === 'success') {
                 toast({
                description: (<div className=' flex items-center gap-2'><FiCheck size={20} /><p>Newsletter deleted successfully</p></div>)
                })
            }

            if ( response.data.message === 'failed') {
                 toast({
                    variant:'destructive',
                description: (<div className=' flex items-center gap-2'><RiCloseFill size={20} /><p>{response.data.data}</p></div>)
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

    const handleDelete = () => {
        deleteNews()
         setTimeout(() => {
            refresh();
        }, 1000);
    }

     const handleEditnews = () => {
        editNews()
         setTimeout(() => {
            refresh();
        }, 1000);
    }

      const handleAddnews = () => {
        createNews()
        massNews();
         setTimeout(() => {
            refresh();
        }, 1000);
    }

     const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMass(e.target.checked);
  };

    const handleEdit = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCheck(e.target.checked);
  };

  useEffect(() => {
    if ( check === true) {
        setEdit(false)
    }else {
        setEdit(true)
    }
  },[check])

  useEffect(() =>{
    const news = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/subscription/getsubscribers`,{
                 withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    }
            })

            setSubscription(response.data.data)
           
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
    news()
},[])


const createNews = async () => {
    setLoading(true);

    // Validation checks
    if (title === '') {
        setLoading(false);
        toast({ variant: "destructive", title: "Enter a newsletter title" });
        return;
    }
    if (description === '') {
        setLoading(false);
        toast({ variant: "destructive", title: "Enter a newsletter description" });
        return;
    }
    if (selectedImage === null) {
        setLoading(false);
        toast({ variant: "destructive", title: "Please add an image" });
        return;
    }

    try {
        // API call to create news
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/newsletter/createnewsletter`,
            {
                title,
                description,
                bannerimg: selectedFile,
            },
            {
                withCredentials: true,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        if (response.data.message === 'success') {
            setLoading(false);
            setTitle('');
            setDescription('');
            setSelectedImage(null);

            toast({
                description: (
                    <div className="flex items-center gap-2">
                        <FiCheck size={20} />
                        <p>Newsletter successfully created</p>
                    </div>
                ),
            });

            // Send email notifications to subscribers
            await sendEmailToSubscribers(title, description);
        }

        if (response.data.message === 'failed') {
            setLoading(false);
            toast({
                variant: 'destructive',
                description: (
                    <div className="flex items-center gap-2">
                        <FiCheck size={20} />
                        <p>{response.data.data}</p>
                    </div>
                ),
            });
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError<{ message: string; data: string }>;
            if (axiosError.response) {
                const { status, data } = axiosError.response;
                if (status === 401) {
                    router.push('/');
                    toast({
                        variant: "destructive",
                        title: `${data.message}`,
                        description: `${data.data}`,
                    });
                }
                if (status === 400) {
                    toast({
                        variant: "destructive",
                        title: `${data.message}`,
                        description: `${data.data}`,
                    });
                }
            }
        }
    }
};

// Helper function to send emails using EmailJS
const sendEmailToSubscribers = async (newsTitle: string, newsDescription: string) => {
    try {
        // Fetch subscribers
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/subscription/getsubscribers`,
            {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        const subscribers = response.data.data; // Assuming this is an array of emails

        console.log(subscribers)

        // Send email to each subscriber
        for (const subscriber of subscribers) {
            await emailjs.send(
                process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
                process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
                {
                    to_name: subscriber.email,
                    from_name: "Rise of Fearless", 
                    to_email: subscriber.email,
                    subject: ` ${title}`,
                    message: description, 
                    banner_img: ''
                },
                process.env.NEXT_PUBLIC_EMAILJS_USER_ID
            );
        }
        toast({
            variant: "default",
            title: `Newsletter sent to all subscribers!`,
        });
    } catch (error) {
        toast({
            variant: "destructive",
            title: `Failed to send newsletter to subscribers.`,
        });
    }
};


    
  return (
    <div className=' flex w-full'>
        <Sidebar/>
        <main className=' bg-zinc-900 h-screen  overflow-y-auto w-full text-white'
        style={{backgroundImage: "url('/dashboard/assets/BG.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat:"no-repeat"}}
        
        >
           <Header/>

            <div className=' flex flex-col gap-8 w-full p-4 md:p-8'>
                <div className=' relative w-full h-[180px] rounded-lg flex items-end p-6 shadow-lg border-[1px] border-opacity-50 border-orange-300'
                style={{backgroundImage: "url('/dashboard/assets/Tab.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat:"no-repeat"}}

                >
                    <div className=' absolute top-0 left-0 w-full h-full bg-gradient-to-r from-[#000000] to-[#00000000] rounded-lg'>

                    </div>
                    <h2 className=' relative z-10 text-2xl font-bold text-secondary'>Newsletter</h2>

                </div>

                <div className=' flex items-center bg-zinc-800 w-fit text-xs p-1 rounded-sm'>
                    <p onClick={() => setTab('tab1')} className={` cursor-pointer px-4 py-2 ${tab === 'tab1' && 'bg-orange-500'} rounded-sm`}>Newsletter</p>
                    <p onClick={() => setTab('tab2')} className={` cursor-pointer px-4 py-2 ${tab === 'tab2' && 'bg-orange-500'} rounded-sm`}>Subscriber</p>

                </div>

                {tab === 'tab1' && (
                    <>
                     <div className=' flex items-center gap-4'>
                    
                            <div className=' flex items-center gap-2'>
                                
                                <Dialog>
                                <DialogTrigger>
                                    <button
                                    style={{backgroundImage: "url('/button.png')", backgroundSize: "contain", backgroundPosition: "center", backgroundRepeat:"no-repeat"}}
                                    className=' h-10 w-[220px] text-xs font-bold text-amber-950 hover:scale-105 ease-in-out duration-200 flex items-center justify-center gap-2'
                                    >Add Newsletter</button>
                                </DialogTrigger>
                                <DialogContent className=' w-[90%] md:w-[500px] h-auto bg-zinc-950 border-zinc-900 text-white'
                                style={{backgroundImage: "url('/dashboard/assets/BG.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat:"no-repeat"}}
                                >
                                <div className=' w-full h-full md:p-4'>
                                    <p className=' text-lg font-semibold text-secondary'>News Information</p>

                                    <div className=' grid grid-cols-2 gap-1 md:gap-4 mt-6'>
                                        <div className=' flex flex-col'>
                                            <div className=' w-[80%] h-[150px] rounded-md bg-zinc-900'>
                                                <img src={selectedImage as string} alt="" />

                                            </div>
                                            <input type="file" accept="image/*" onChange={handleChange} className=' text-xs mt-4 cursor-pointer' />

                                        </div>

                                        <div className=' flex flex-col gap-2'>
                                            <Input placeholder='Title' value={title} onChange={(e) => setTitle(e.target.value)} type='text' className=' bg-zinc-900 border-none'/>
                                            <Textarea value={description}  onChange={(e) => setDescription(e.target.value)} placeholder='Description' className=' bg-zinc-900 border-none'/>
                                            {/* <div className=' flex items-center gap-2'>
                                                <input
                                                type="checkbox"
                                                checked={mass}
                                                onChange={handleCheckboxChange}
                                                />
                                                <p className=' text-xs text-zinc-300'>Send message to all players</p>
                                            </div> */}
                                        </div>

                                    </div>

                                

                                    <div className=' w-full flex items-center justify-center mt-8'>
                                        <button
                                        onClick={handleAddnews}
                                        style={{backgroundImage: "url('/button.png')", backgroundSize: "contain", backgroundPosition: "center", backgroundRepeat:"no-repeat"}}
                                        className=' h-10 w-[180px] text-xs font-bold text-amber-950 hover:scale-105 ease-in-out duration-200 flex items-center justify-center gap-2'
                                        >
                                            { loading === true && (
                                                <div className="loader">
                                                    <div className="bar1 bg-zinc-950"></div>
                                                    <div className="bar2 bg-zinc-950"></div>
                                                    <div className="bar3 bg-zinc-950"></div>
                                                    <div className="bar4 bg-zinc-950"></div>
                                                    <div className="bar5 bg-zinc-950"></div>
                                                    <div className="bar6 bg-zinc-950"></div>
                                                    <div className="bar7 bg-zinc-950"></div>
                                                    <div className="bar8 bg-zinc-950"></div>
                                                    <div className="bar9 bg-zinc-950"></div>
                                                    <div className="bar10 bg-zinc-950"></div>
                                                    <div className="bar11 bg-zinc-950"></div>
                                                    <div className="bar12 bg-zinc-950"></div>
                                                </div>
                                            )}
                                            Add newsletter</button>
                                    </div>

                                    
                                </div>
                                </DialogContent>
                                </Dialog>

                                <button onClick={refresh} className=' p-2 bg-secondary text-zinc-950 rounded-md'><HiRefresh size={20}/></button>

                            </div>

                        </div>
                            
                        { listLoad ? (
                            <>
                            <div className=' w-full flex items-center justify-center'>
                                <div className="loader">
                                    <div className="bar1 bg-secondary"></div>
                                    <div className="bar2 bg-secondary"></div>
                                    <div className="bar3 bg-secondary"></div>
                                    <div className="bar4 bg-secondary"></div>
                                    <div className="bar5 bg-secondary"></div>
                                    <div className="bar6 bg-secondary"></div>
                                    <div className="bar7 bg-secondary"></div>
                                    <div className="bar8 bg-secondary"></div>
                                    <div className="bar9 bg-secondary"></div>
                                    <div className="bar10 bg-secondary"></div>
                                    <div className="bar11 bg-secondary"></div>
                                    <div className="bar12 bg-secondary"></div>
                                </div>
                            </div>
                            </>
                        ):(
                            <>
                            <Table>
                            <TableHeader className=' bg-amber-800 border-b-2 border-orange-300'>
                                <TableRow>
                                <TableHead >Id</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Image</TableHead>
                                <TableHead >Description</TableHead>
                                <TableHead >Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                { news.map((list, idx) => (
                                    <TableRow key={idx} className=' bg-[#080808b4]'>
                                    <TableCell >{list.newsid}</TableCell>
                                    <TableCell>{list.title}</TableCell>

                                    <Dialog>
                                    <DialogTrigger>
                                        <TableCell className=' flex items-center justify-center'>
                                            <button className=' text-xs px-2 py-1 bg-blue-800 rounded-md flex items-center gap-1'><IoMdEye size={15}/>View</button>
                                        </TableCell>
                                    </DialogTrigger>
                                    <DialogContent className=' w-[90%] md:w-auto h-auto p-10 flex items-center justify-center bg-zinc-950 border-zinc-900'
                                    style={{backgroundImage: "url('/dashboard/assets/BG.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat:"no-repeat"}}
                                    
                                    >
                                        <img src={`${process.env.NEXT_PUBLIC_API_URL}/${list.banner}`} alt="" width={300} height={300} />
                                    </DialogContent>
                                    </Dialog>

                                    <TableCell className=' text-sm'><p className=' line-clamp-3'>{list.description}</p></TableCell>
                                    <TableCell className=' flex items-center gap-2' >

                                        <Dialog>
                                        <DialogTrigger>
                                            <TableCell>
                                                <button
                                                onClick={() => {setEditTitle(list.title); setEditDescription(list.description); setId(list.newsid)}}
                                                className=' text-xs px-2 py-1 bg-blue-800 rounded-md flex items-center gap-1'><IoMdEye size={15}/>View</button>
                                            </TableCell>
                                        </DialogTrigger>
                                        <DialogContent className=' flex-col w-[90%] md:w-[40%] h-auto p-4 md:p-10 flex items-center justify-center bg-zinc-950 border-zinc-900 text-white'
                                        style={{backgroundImage: "url('/dashboard/assets/BG.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat:"no-repeat"}}
                                        
                                        >
                                        
                                            <div className=' w-[200px] h-[200px] flex items-center justify-center rounded-lg bg-zinc-900'>
                                                { selectedImage === null && (
                                                    <img src={`${process.env.NEXT_PUBLIC_API_URL}/${list.banner}`} alt="" width={250} height={150} />
                                                )}

                                                { selectedImage !== null && (
                                                    <img src={selectedImage as string} alt="" />
                                                )}
                                                
                                                
                                            </div>
                                            <input type="file" accept="image/*" onChange={handleChange} className=' text-xs mt-4' />
                                            <Input onChange={(e) => setEditTitle(e.target.value)} disabled={edit} placeholder='Title' type='text' value={editTitle} className=' bg-zinc-900 text-white border-none '/>
                                            <Textarea onChange={(e) => setEditDescription(e.target.value)} disabled={edit} value={editdescription} placeholder='Description' className=' bg-zinc-900 border-none h-[150px]'/>
                                            <div className=' w-full flex items-start gap-2'>
                                            <input
                                                type="checkbox"
                                                checked={check}
                                                onChange={handleEdit}
                                                className=' h-4 w-4 bg-none border-2'
                                                />
                                                <p className=' text-xs text-zinc-300'>Edit news</p>
                                            </div>

                                            <div className=' w-full flex items-center justify-end gap-4 mt-4'>
                                                <button onClick={handleEditnews} className=' px-4 py-2 w-[180px] rounded-lg flex items-center justify-center gap-2 text-amber-950 text-sm font-bold'
                                                style={{backgroundImage: "url('/button.png')", backgroundSize: "contain", backgroundPosition: "center", backgroundRepeat:"no-repeat"}}
                                                >
                                                    { editload === true && (
                                                        <>
                                                        <div className="loader">
                                                            <div className="bar1 bg-zinc-950"></div>
                                                            <div className="bar2 bg-zinc-950"></div>
                                                            <div className="bar3 bg-zinc-950"></div>
                                                            <div className="bar4 bg-zinc-950"></div>
                                                            <div className="bar5 bg-zinc-950"></div>
                                                            <div className="bar6 bg-zinc-950"></div>
                                                            <div className="bar7 bg-zinc-950"></div>
                                                            <div className="bar8 bg-zinc-950"></div>
                                                            <div className="bar9 bg-zinc-950"></div>
                                                            <div className="bar10 bg-zinc-950"></div>
                                                            <div className="bar11 bg-zinc-950"></div>
                                                            <div className="bar12 bg-zinc-950"></div>
                                                        </div>
                                                        </>
                                                    )}
                                                    Save Changes</button>
                                            </div>
                                        
                                        </DialogContent>
                                        </Dialog>

                                        <AlertDialog>
                                        <AlertDialogTrigger>
                                            <button onClick={() => setId(list.newsid)} className=' text-xs px-2 py-1 bg-red-600 rounded-md flex items-center gap-1'><RiDeleteBin5Fill size={15}/>Delete</button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent className=' bg-zinc-950 border-zinc-900 text-white w-[90%] md:w-auto'>
                                            <AlertDialogHeader>
                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This will permanently delete news data
                                                and remove the data from the server. <p className=' text-sm text-red-600'>{list.newsid}</p>
                                            </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                            <AlertDialogCancel className=' bg-zinc-900 border-none hover:bg-zinc-800 text-white'><p className=' text-white'>Cancel</p></AlertDialogCancel>
                                            <AlertDialogAction onClick={handleDelete} className=' bg-red-600 hover:bg-red-700 text-white'>Continue</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                        </AlertDialog>
                                        
                                    </TableCell>
                                    </TableRow>
                                ))}
                            
                            </TableBody>
                            </Table>
                            </>
                        )}
                        
                    

                        <div className=' flex items-center justify-end gap-4'>
                            <button 
                            onClick={() => setCurrentpage( currentpage - 1)}
                            disabled={loading ? true : currentpage === 0} 
                        className=' cursor-pointer  bg-gradient-to-r from-orange-200 to-orange-400 rounded-md text-amber-950 px-6'><TiArrowLeftThick size={30}/></button>
                            {/* <p className=' text-sm font-bold bg-zinc-950 px-4 py-2 text-center  rounded-md'>{currentpage + 1}</p> */}
                            <button
                            onClick={() => setCurrentpage(currentpage + 1)}
                            disabled={ loading ? true :  currentpage + 1 === totalpages}
                            className=' cursor-pointer bg-gradient-to-r from-orange-200 to-orange-400 rounded-md text-amber-950 px-6'><TiArrowRightThick size={30}/></button>

                    </div>
                    </>
                )}

                {tab === 'tab2' && (
                    <Subcribers/>
                )}
               
            </div>
             
        </main>
      

    </div>
  )
}
