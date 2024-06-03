"use client"

import Sidebar from '@/components/Sidebar'
import React, { useEffect, useState } from 'react'
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
import { Checkbox } from "@/components/ui/checkbox"
import { BsPersonPlusFill } from "react-icons/bs";
import { FaUsers } from "react-icons/fa";
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import axios, {AxiosError} from 'axios'
import { useRouter } from 'next/navigation'
import { MdOutlineKeyboardArrowLeft,  MdOutlineKeyboardArrowRight } from "react-icons/md";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { HiRefresh } from "react-icons/hi";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"




interface PlayerList{
    country: string
    createdAt: string
    email: string
    id: string
    status: string
    username: string

}

interface Inbox {
    description: string
    title: string
    type: string

}

export default function page() {
  const { toast } = useToast()
  const router = useRouter()
  const [player, setPlayer] = useState<PlayerList[]>([])
  const [ totalpages, setTotalpages] = useState(0)
  const [ currentpage, setCurrentpage] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('')

  const [ status, setStatus] = useState('')
  const [ id, setId] = useState('')
  const [ banload, setBanload] = useState(false)
  const [tab, setTab] = useState('dashboard')

  const [userid, setUserid] = useState('')
  const [ inbox, setInbox] = useState<Inbox[]>([])
  const [active, setActive] = useState('')

  console.log('Title:', active)

  console.log(id,status)

    useEffect(() => {
        setLoading(true)
        const playerList = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/getplayerlist?page=${currentpage}&limit=10&search=${search}&filter=${filter}`,{
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                        }
                })
                setLoading(false)
                setPlayer(response.data.data.userlist)
                setTotalpages(response.data.data.totalPages)
                console.log(response.data)
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
                } 
                
            }
        }
        playerList()

    },[currentpage, filter])

    const searchByusername = async () => {
        if ( search === ''){
            toast({
            variant: "destructive",
            title: "Error",
            description: "Please enter a username",
            })
        }
        if ( search !== ''){
            setLoading(true)
              try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/getplayerlist?page=${currentpage}&limit=10&search=${search}&filter=`,{
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                        }
                })
                setCurrentpage(0)
                setLoading(false)
                setSearch('')
                setPlayer(response.data.data.userlist)
                setTotalpages(response.data.data.totalPages)
                console.log(response.data)
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

    const reset = async () => {
            setLoading(true)
              try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/getplayerlist?page=${currentpage}&limit=10&search=&filter=`,{
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                        }
                })
                setCurrentpage(0)
                setFilter('')
                setLoading(false)
                setPlayer(response.data.data.userlist)
                setTotalpages(response.data.data.totalPages)
                console.log(response.data)
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
                        localStorage.setItem('auth', 'false');
                        toast({
                        variant: "destructive",
                         title: `${axiosError.response.data.message}`,
                        description: `${axiosError.response.data.data}`
                        })
                
                    }
                } 
                
        }
        
    }

    const ban =  async () => {
        if ( status !== ''  && id !== ''){
            setBanload(true)
               try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/user/banunbanuser`,{
            status: 'inactive',
            userid: id

            },{
                withCredentials: true,
                headers: {
                        'Content-Type': 'application/json',
                        }
            })
            console.log(response.data)

            if ( response.data.message == 'success'){
                setBanload(false)
                 toast({
                title: "Success",
                description: "Player banned successfully",
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

    const unban =  async () => {
        if ( status !== ''  && id !== ''){
            setBanload(true)
               try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/user/banunbanuser`,{
            status: 'active',
            userid: id

            },{
                withCredentials: true,
                headers: {
                        'Content-Type': 'application/json',
                        }
            })
            console.log(response.data)

            if ( response.data.message == 'success'){
                setBanload(false)
                 toast({
                title: "Success",
                description: "Player unbanned successfully",
                })
            }
            
        } catch (error) {
            if (axios.isAxiosError(error)) {
                    const axiosError = error as AxiosError<{ message: string, data: string }>;
                    if (axiosError.response && axiosError.response.status === 401) {
                        localStorage.setItem('auth', 'false');
                        router.push('/')
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

    const [ title, setTitle] = useState('')
    const [ description, setDescription] = useState('')

    {/*Player Inbox*/}
    useEffect(() => {
        const playerInbox = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/inbox/viewplayermessage?userid=662879c170e59d41e4f38eac`,{
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                        }
                })
                setInbox(response.data.data.inbox)
                console.log('Inbox',response.data)
            } catch (error) {
                 if (axios.isAxiosError(error)) {
                    const axiosError = error as AxiosError<{ message: string, data: string }>;
                    if (axiosError.response && axiosError.response.status === 401) {
                        localStorage.setItem('auth', 'false');
                        router.push('/')
                        toast({
                        variant: "destructive",
                        title: `${axiosError.response.data.message}`,
                        description: `${axiosError.response.data.data}`
                        })
                
                    }
                }
                
            }
        }
        playerInbox()
     },[userid])


    const formatISODate = (isoString: any) => {
    const date = new Date(isoString);
    const formattedDate = date.toLocaleDateString(); // Format date as per locale
    const formattedTime = date.toLocaleTimeString(); // Format time as per locale
    return `${formattedDate} ${formattedTime}`;
    };

  return (
    <div className=' flex w-full h-screen overflow-x-hidden'>
        <Sidebar/>
        <main className=' bg-zinc-900 w-full text-white'>
           <Header/>

         
            <div className=' flex flex-col gap-8 w-full p-4 md:p-8'>

                <div className=' grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4'>

                    <div className=' flex flex-col gap-5 items-center justify-center w-full h-[180px] rounded-lg bg-zinc-950 p-4'>
                        <BsPersonPlusFill size={30} className=' text-secondary'/>

                        <div className=' flex flex-col gap-2 items-center p-2'>
                            <p className=' text-xl font-semibold'>12,967</p>
                            <p className=' text-xs text-zinc-200'>Total Joinings</p>

                        </div>
                    </div>

                    <div className=' flex flex-col gap-5 items-center justify-center w-full h-[180px] rounded-lg bg-zinc-950 p-4'>
                        <FaUsers size={30} className=' text-secondary'/>
                        {/* <lord-icon
                            src="https://cdn.lordicon.com/hrjifpbq.json"
                            trigger="hover"
                            style="width:250px;height:250px">
                        </lord-icon> */}

                        <div className=' flex flex-col gap-2 items-center p-2'>
                            <p className=' text-xl font-semibold'>1,478</p>
                            <p className=' text-xs text-zinc-200'>Todays Joinings</p>

                        </div>
                    </div>

                </div>

                <div className=' flex flex-col lg:flex-row items-center gap-4'>
                     <div className=' flex items-center gap-2'>
                        <Input placeholder='Search by username or email' value={search} onChange={(e) => setSearch(e.target.value)} type='text' className=' bg-zinc-950 border-none w-[200px] lg:w-[300px]'/>
                        <button
                        onClick={searchByusername}
                        style={{backgroundImage: "url('/button.png')", backgroundSize: "contain", backgroundPosition: "center", backgroundRepeat:"no-repeat"}}
                        className=' h-10 w-[120px] md:w-[150px] text-sm font-bold text-amber-950 hover:scale-105 ease-in-out duration-200 flex items-center justify-center gap-2'
                        >
                       
                            Search</button>
                    </div>

                   

                    <div className=' flex items-center gap-4'>
                        <Select onValueChange={setFilter} value={filter}>
                        <SelectTrigger className="w-[180px] bg-zinc-950 border-none">
                            <SelectValue placeholder="Filter" />
                        </SelectTrigger>
                        <SelectContent className=' bg-zinc-950 border-none'>
                            <SelectItem value='active' className=' hover:bg-none text-white'>Unban</SelectItem>
                            <SelectItem value='inactive' className=' hover:bg-none text-white'>Banned</SelectItem>
                        </SelectContent>
                        </Select>

                    <button onClick={reset} className=' px-4 py-2 bg-secondary text-zinc-950 rounded-md'><HiRefresh size={20}/></button>

                    </div>


                </div>
                    
                {loading ? (
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
                ) : (
                    <>
                    <Table>
                    <TableHeader className=' bg-zinc-950 hover:bg-zinc-950 text-white'>
                        <TableRow>
                        <TableHead className="w-[50px]">Select</TableHead>
                        <TableHead>Username</TableHead>
                        <TableHead>Account Status</TableHead>
                        <TableHead >Date Joined</TableHead>
                        <TableHead >Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        { player.map((list, idx) => (
                            <TableRow className=' bg-[#080808b4]'>
                            <TableCell className="font-medium"><Checkbox /></TableCell>
                            <TableCell>{list.username}</TableCell>
                            <TableCell className={`${list.status === 'active' && ' text-green-500'} ${list.status === 'inactive' && ' text-red-600'}`}>{list.status}</TableCell>
                            <TableCell >{formatISODate(list.createdAt)}</TableCell>
                            <TableCell className=' flex items-center justify-center gap-2'>
 
                                <Dialog>
                                <DialogTrigger onClick={() => setUserid(list.id)}>
                                    <button className=' bg-secondary px-2 py-1 rounded-md text-xs'>View</button>
                                </DialogTrigger>
                                <DialogContent className=' flex flex-col items-start bg-zinc-950 border-zinc-900 w-[90%] h-[600px] md:w-[800px] '
                                style={{backgroundImage: "url('/assets/header BG.png')", backgroundSize: "contain", backgroundPosition: "center", backgroundRepeat:"no-repeat"}}
                                >
                                    <Popover>
                                    <PopoverTrigger className=' block md:hidden text-white bg-zinc-900 p-2 rounded-md text-xs'>Menu</PopoverTrigger>
                                    <PopoverContent className=' bg-zinc-950 border-zinc-900 text-white w-[150px]'>
                                        <p onClick={()=> setTab('dashboard')} className={`text-xs px-4 py-1 cursor-default ${tab === 'dashboard' && ' border-b-2 border-secondary'}`}>Dashboard</p>
                                        <p onClick={()=> setTab('inventory')} className={`text-xs px-4 py-1 cursor-default ${tab === 'inventory' && ' border-b-2 border-secondary'}`}> Inventory</p>
                                        <p onClick={()=> setTab('transaction')} className={`text-xs px-4 py-1 cursor-default ${tab === 'transaction' && ' border-b-2 border-secondary'}`}>Transaction history</p>
                                        <p onClick={()=> setTab('inbox')} className={`text-xs px-4 py-1 cursor-default ${tab === 'inbox' && ' border-b-2 border-secondary'}`}>Inbox</p>
                                        <p onClick={()=> setTab('profile')} className={`text-xs px-4 py-1 cursor-default ${tab === 'profile' && ' border-b-2 border-secondary'}`}>Profile</p>
                                    </PopoverContent>
                                    </Popover>

                                    <div className=' hidden md:flex items-center justify-center text-white'>
                                        <p onClick={()=> setTab('dashboard')} className={`text-sm font-semibold px-4 py-1 cursor-default ${tab === 'dashboard' && ' border-b-4 border-secondary'}`}>Dashboard</p>
                                        <p onClick={()=> setTab('inventory')} className={`text-sm font-semibold px-4 py-1 cursor-default ${tab === 'inventory' && ' border-b-4 border-secondary'}`}> Inventory</p>
                                        <p onClick={()=> setTab('transaction')} className={`text-sm font-semibold px-4 py-1 cursor-default ${tab === 'transaction' && ' border-b-4 border-secondary'}`}>Transaction history</p>
                                        <p onClick={()=> setTab('inbox')} className={`text-sm font-semibold px-4 py-1 cursor-default ${tab === 'inbox' && ' border-b-4 border-secondary'}`}>Inbox</p>
                                        <p onClick={()=> setTab('profile')} className={`text-sm font-semibold px-4 py-1 cursor-default ${tab === 'profile' && ' border-b-4 border-secondary'}`}>Profile</p>

                                    </div>
                                    {tab === 'dashboard' && (
                                        <div className=' bg-zinc-900 w-full h-full rounded-lg flex items-center justify-center'>
                                            <p className=' text-xs text-zinc-300'>Coming Soon!</p>
                                        </div>
                                    )}

                                     {tab === 'inventory' && (
                                        <div className=' bg-zinc-900 w-full h-full rounded-lg flex items-center justify-center'>
                                            <p className=' text-xs text-zinc-300'>Coming Soon!</p>
                                        </div>
                                    )}

                                    {tab === 'transaction' && (
                                        <div className=' bg-zinc-900 w-full h-full rounded-lg flex items-center justify-center'>
                                            <p className=' text-xs text-zinc-300'>Coming Soon!</p>
                                        </div>
                                    )}

                                    {tab === 'inbox' && (
                                        <>
                                        <p className=' text-white md:hidden block'>Messages</p>
                                        
                                        <Dialog>
                                        <DialogTrigger className=' h-[460px] overflow-y-auto'>
                                            <div className=' md:hidden w-full flex flex-col gap-2 text-white '>
                                             { inbox.map((list, idx)=>(
                                                        <div 
                                                        onClick={() =>{setTitle(list.title); setDescription(list.description); setActive(list.title)}}
                                                        key={idx} 
                                                        className={`flex items-center justify-between gap-4 w-full rounded-lg border-[1px] border-zinc-200 text-white p-3 ${list.title === active && ' border-yellow-500'}`}
                                                        >
                                                            <img src="/assets/Mail ICON.png" alt="" width={30} />

                                                            <div className=' flex flex-col items-start h-[70px] w-[50%] gap-1'>
                                                                <p className=' text-xs font-semibold line-clamp-1'>{list.title}</p>
                                                                <p className=' text-[.6em] line-clamp-2 text-zinc-400'>{list.description}</p>
                                                                
                                                                <p className=' text-[.5em] text-zinc-400'>From: Dev Team</p>
                                                            </div>

                                                            <div className=' flex flex-col items-end justify-end gap-2 w-[70px]'>
                                                                <p className=' text-[.6em] text-zinc-400'>4 days ago</p>
                                                            </div>

                                                        </div>
                                            ))}
                                                    

                                        </div>
                                        </DialogTrigger>
                                        <DialogContent className=' w-[90%] bg-zinc-950 border-zinc-900'>
                                            <DialogHeader>
                                            <DialogTitle className=' text-secondary'>{title}</DialogTitle>
                                            <DialogDescription>
                                               {description}
                                            </DialogDescription>
                                            </DialogHeader>
                                        </DialogContent>
                                        </Dialog>

                                        </>
                                    )}

                                    {tab === 'inbox' && (
                                        <div className=' hidden relative w-full h-[500px] rounded-lg md:flex flex-col gap-2 items-center p-14'
                                         style={{backgroundImage: "url('/assets/TAB.png')", backgroundSize: "contain", backgroundPosition: "center", backgroundRepeat:"no-repeat"}}
                                        ><p className=' absolute top-11 left-6 text-lg text-amber-950 font-semibold'>Messages</p>
                                            <div className=' w-full grid grid-cols-2 place-items-start gap-4 mt-12'>

                                                <div className=' flex flex-col items-start gap-1 w-full h-[300px] overflow-y-auto'>

                                                    { inbox.map((list, idx)=>(
                                                        <div 
                                                        onClick={() =>{setTitle(list.title); setDescription(list.description); setActive(list.title)}}
                                                        key={idx} 
                                                        className={`flex items-center justify-between gap-4 w-full rounded-lg border-[1px] border-zinc-200 text-white p-3 ${list.title === active && ' border-yellow-600'}`}
                                                        style={{backgroundImage: "url('/assets/list TAB (off).png')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat:"no-repeat"}}
                                                        >
                                                            <img src="/assets/Mail ICON.png" alt="" width={30} />

                                                            <div className=' flex flex-col items-start h-[70px] w-[50%] gap-1'>
                                                                <p className=' text-xs font-semibold line-clamp-1'>{list.title}</p>
                                                                <p className=' text-[.6em] line-clamp-2 text-zinc-400'>{list.description}</p>
                                                                
                                                                <p className=' text-[.5em] text-zinc-400'>From: Dev Team</p>
                                                            </div>

                                                            <div className=' flex flex-col items-end justify-end gap-2 w-[70px]'>
                                                                <p className=' text-[.6em] text-zinc-400'>4 days ago</p>
                                                            </div>

                                                        </div>
                                                    ))}
                                                    
                                                </div>

                                                 <div className=' w-full h-[270px] text-white p-2'
                                                  style={{backgroundImage: "url('/assets/open TAB.png')", backgroundSize: "cover", backgroundPosition: "top", backgroundRepeat:"no-repeat"}}
                                                 >
                                                    <p className=' text-sm font-semibold'>{title}</p>
                                                    <div className=' w-full overflow-y-auto h-[180px] mt-6'>
                                                        <p className=' text-xs text-zinc-200 '>{description}</p>

                                                    </div>

                                                </div>

                                            </div>

                                          
                                            
                                        </div>
                                    )}

                                    {tab === 'profile' && (
                                        <div className=' bg-zinc-900 w-full h-[500px] overflow-y-auto rounded-lg flex flex-col gap-2 items-center justify-center p-4 py-10'>
                                           
                                            <div className=' flex flex-col md:flex-row items-center gap-2 bg-zinc-950 p-4 rounded-lg w-[90%] md:w-[70%]'>
                                                <div className=' w-16 h-16 rounded-lg bg-secondary'>

                                                </div>
                                                <div className=' flex flex-col gap-1'>
                                                    <p className=' text-sm font-semibold text-zinc-100'>{list.username}</p>
                                                    <p className=' text-xs text-zinc-300'>{list.id}</p>
                                                </div>
                                            </div>

                                            <div className=' flex flex-col md:flex-row items-center gap-2 bg-zinc-950 p-4 rounded-lg w-[90%] md:w-[70%]'>
                                                <Input placeholder='Password' type='password' value={12345678} className=' bg-zinc-900 text-white border-none '/>

                                                <button
                                                            style={{backgroundImage: "url('/button.png')", backgroundSize: "contain", backgroundPosition: "center", backgroundRepeat:"no-repeat"}}
                                                            className=' flex items-center justify-center gap-2 h-20 w-[180px] font-bold text-amber-950 hover:scale-110 ease-in-out duration-200 text-xs'
                                                        
                                                            >
                                                           
                                                Change Password</button>
                                            </div>

                                            <div className=' flex flex-col md:flex-row items-center justify-between gap-4 bg-zinc-950 p-6 rounded-lg w-[90%] md:w-[70%]'>
                                                <div className=' flex flex-col gap-4'>
                                                    <div className=' flex flex-col'>
                                                        <p className=' text-xs text-zinc-400'>Email:</p>
                                                        <p className=' text-sm text-zinc-100'>{list.email}</p>
                                                    </div>
                                                    <div className=' flex flex-col'>
                                                        <p className=' text-xs text-zinc-400'>Country:</p>
                                                        <p className=' text-sm text-zinc-100'>{list.country}</p>
                                                    </div>

                                                </div>

                                                <div className=' flex flex-col gap-4'>
                                                    <div className=' flex flex-col'>
                                                        <p className=' text-xs text-zinc-400'>Status:</p>
                                                        <p className={`text-sm ${list.status === 'active' && ' text-green-500'} ${list.status === 'inactive' && ' text-red-500'}`}>{list.status}</p>
                                                    </div>
                                                    <div className=' flex flex-col'>
                                                        <p className=' text-xs text-zinc-400'>Account Creation:</p>
                                                        <p className=' text-sm text-zinc-100'>{list.createdAt}</p>
                                                    </div>

                                                </div>
                                            </div>
                                       
                                        </div>
                                    )}
                                    
                                </DialogContent>
                                </Dialog>

                                <AlertDialog>
                                <AlertDialogTrigger>
                                     { list.status === 'inactive' && (
                                    <button 
                                    onClick={() => {setStatus(list.status); setId(list.id)}}
                                    className=' text-xs px-2 py-1 bg-green-600 rounded-md'>UnBan</button>
                                    )}
                                </AlertDialogTrigger>
                                <AlertDialogContent className=' bg-zinc-950 border-zinc-900'>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle className=' text-secondary'>Are you absolutely sure to unban this player?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will temporarily unbanned the player account.
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel className=' bg-zinc-900 border-none text-white'>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={unban} className=' flex items-center justify-center gap-2 bg-red-600'>
                                        { banload === true && (
                                            <div className="loader">
                                                <div className="bar1 bg-white"></div>
                                                <div className="bar2 bg-white"></div>
                                                <div className="bar3 bg-white"></div>
                                                <div className="bar4 bg-white"></div>
                                                <div className="bar5 bg-white"></div>
                                                <div className="bar6 bg-white"></div>
                                                <div className="bar7 bg-white"></div>
                                                <div className="bar8 bg-white"></div>
                                                <div className="bar9 bg-white"></div>
                                                <div className="bar10 bg-white"></div>
                                                <div className="bar11 bg-white"></div>
                                                <div className="bar12 bg-white"></div>
                                            </div>
                                        )}
                                        Continue</AlertDialogAction>
                                    </AlertDialogFooter>

                                </AlertDialogContent>
                                </AlertDialog>


                                <AlertDialog>
                                <AlertDialogTrigger>
                                    { list.status === 'active' && (
                                    <button 
                                    onClick={() => {setStatus(list.status); setId(list.id)}}
                                    className=' text-xs px-4 py-1 bg-red-600 rounded-md'>Ban</button>
                                    )}
                                </AlertDialogTrigger>
                                <AlertDialogContent className=' bg-zinc-950 border-zinc-900'>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle className=' text-secondary'>Are you absolutely sure to ban this player?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will temporarily banned the player account.
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel className=' bg-zinc-900 border-none text-white'>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={ban} className=' flex items-center justify-center gap-2 bg-red-600'>
                                        { banload === true && (
                                            <div className="loader">
                                                <div className="bar1 bg-white"></div>
                                                <div className="bar2 bg-white"></div>
                                                <div className="bar3 bg-white"></div>
                                                <div className="bar4 bg-white"></div>
                                                <div className="bar5 bg-white"></div>
                                                <div className="bar6 bg-white"></div>
                                                <div className="bar7 bg-white"></div>
                                                <div className="bar8 bg-white"></div>
                                                <div className="bar9 bg-white"></div>
                                                <div className="bar10 bg-white"></div>
                                                <div className="bar11 bg-white"></div>
                                                <div className="bar12 bg-white"></div>
                                            </div>
                                        )}
                                        Continue</AlertDialogAction>
                                    </AlertDialogFooter>

                                </AlertDialogContent>
                                </AlertDialog>

                                
                            </TableCell>
                            </TableRow>
                        ))}
                        
                    </TableBody>
                    </Table>
                    {player.length === 0 && (
                        <p className=' w-full text-center text-sm text-red-600'>No data</p>
                    )}
                    </>
                )}
              

                <div className=' flex items-center justify-center gap-4'>
                    <button 
                    onClick={() => setCurrentpage( currentpage - 1)}
                    disabled={loading ? true : currentpage === 0} 
                   className=' text-secondary'><MdOutlineKeyboardArrowLeft size={40}/></button>
                    <p className=' text-sm font-bold bg-zinc-950 px-4 py-2 text-center  rounded-md'>{currentpage + 1}</p>
                    <button
                      onClick={() => setCurrentpage(currentpage + 1)}
                    disabled={ loading ? true :  currentpage + 1 === totalpages}
                    className=' text-secondary'><MdOutlineKeyboardArrowRight size={40}/></button>

                </div>

               
            </div>
             
        </main>
      

    </div>
  )
}
