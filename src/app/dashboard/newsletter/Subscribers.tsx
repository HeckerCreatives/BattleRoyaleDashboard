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
import Loader from '@/components/Loader'


type Subscriber = {
    email: string
    _id:string
    createdAt:string 
    updatedAt: string
}
export default function Subcribers() {
    const { toast } = useToast()
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [list, setList] = useState<Subscriber[]>([])
    const [ totalpages, setTotalPages] = useState(0)
    const [ listLoad, setListload] = useState(false)
    const [ currentpage, setCurrentpage] = useState<number>(0)
    const [open, setOpen] = useState(false)

    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const handleCheckboxChange = (id: string) => {
        setSelectedIds((prevSelectedIds) => {
        if (prevSelectedIds.includes(id)) {
            return prevSelectedIds.filter((selectedId) => selectedId !== id);
        } else {
            return [...prevSelectedIds, id];
        }
        });
    };

    const handleSelectAll = () => {
        if (selectedIds.length === list.length) {
            setSelectedIds([]); // Deselect all
        } else {
            setSelectedIds(list.map((item) => item._id)); // Select all
        }
    };

    const isAllSelected = list.length > 0 && selectedIds.length === list.length;

    useEffect(() =>{
        const getlist = async () => {
            setListload(true)
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/subscription/getsubscriberlist?page=${currentpage}&limit=10`,{
                     withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                        }
                })
            setListload(false)

               setList(response.data.data.data)
               setTotalPages(response.data.data.totalpages)
            
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
        getlist()
    },[currentpage])

    const getlist = async () => {
        setListload(true)
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/subscription/getsubscriberlist?page=${currentpage}&limit=10`,{
                 withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    }
            })
        setListload(false)

           setList(response.data.data.data)
           setTotalPages(response.data.data.totalpages)
        
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

    const unsubscribedUsers = async () =>{
        setLoading(true)
       if(selectedIds.length === 0){
        setLoading(false)

            toast({
                variant:'destructive',
            description: (<div className=' flex items-center gap-2'><RiCloseFill size={20} /><p>Please select a select subscribed user to proceed.</p></div>)
            })
       } else {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/subscription/deletesubscribersbyids`,{
                userIds: selectedIds
            },{
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    }
            })
             if ( response.data.message === 'success') {
        setLoading(false)
        setOpen(false)
        getlist()
                 toast({
                description: (<div className=' flex items-center gap-2'><FiCheck size={20} /><p>User Unsubscribed successfully</p></div>)
                })
            }

            if ( response.data.message === 'failed') {
        setLoading(false)
        setOpen(false)

                 toast({
                    variant:'destructive',
                description: (<div className=' flex items-center gap-2'><RiCloseFill size={20} /><p>{response.data.data}</p></div>)
                })
            }

        } catch (error) {
        setLoading(false)
        setOpen(false)

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

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
      
        // Format the date using Intl.DateTimeFormat
        const formattedDate = new Intl.DateTimeFormat('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZone: 'UTC', // Ensure the date is treated as UTC
        }).format(date);
      
        return formattedDate;
    }
    
  return (
    <div className=' flex flex-col w-full'>
       <div className=' flex items-center gap-4 mb-6'>
                    
                    <div className=' flex items-center gap-2'>
                        
                        <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger>
                            <button
                            style={{backgroundImage: "url('/button.png')", backgroundSize: "contain", backgroundPosition: "center", backgroundRepeat:"no-repeat"}}
                            className=' h-10 w-[180px] text-xs font-bold text-amber-950 hover:scale-105 ease-in-out duration-200 flex items-center justify-center gap-2'
                            >Unsubcribed</button>
                        </DialogTrigger>
                        <DialogContent className=' w-[90%] md:w-[500px] h-auto bg-zinc-950 border-zinc-900 text-white'
                        style={{backgroundImage: "url('/dashboard/assets/BG.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat:"no-repeat"}}
                        >

                            <p className=' text-xl font-semibold'>Unsubcribed</p>
                            <p className=' text-lg text-zinc-500'>Are you sure want to unsubscribed the selected users?</p>

                            <div className=' w-full flex items-end justify-end gap-2'>
                                <button onClick={() => setOpen(false)} className=' w-fit px-4 py-2 text-sm bg-zinc-600 rounded-sm'>Cancel</button>
                                <button onClick={unsubscribedUsers} className=' flex items-center gap-2 w-fit px-4 py-2 text-sm bg-orange-600 rounded-sm'>
                                    {loading === true && (
                                        <Loader/>
                                    )}
                                    Save</button>

                            </div>
                         
                        </DialogContent>
                        </Dialog>


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
                        {list.length === 0 && (
                            <TableCaption>
                                no subscribers
                            </TableCaption>
                        )}
                    <TableHeader className=' bg-amber-800 border-b-2 border-orange-300'>
                        <TableRow>
                        <TableHead className=' flex items-center gap-2 w-[120px]' >
                        <input
                            type="checkbox"
                            checked={isAllSelected}
                            onChange={handleSelectAll}
                        />
                            Select All</TableHead>
                        <TableHead className=' text-start' >Subscribed at</TableHead>
                        <TableHead  className=' text-start'>Email</TableHead>
                       
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        { list.map((list, idx) => (
                            <TableRow key={idx} className=' bg-[#080808b4]'>
                            <TableCell className=' w-[120px]'>
                                <input
                                 type="checkbox"
                                 checked={selectedIds.includes(list._id)}
                                 onChange={() => handleCheckboxChange(list._id)}/>
                                </TableCell>
                            <TableCell >{formatDate(list.createdAt)}</TableCell>
                            <TableCell >{list.email}</TableCell>

                
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
      

    </div>
  )
}
