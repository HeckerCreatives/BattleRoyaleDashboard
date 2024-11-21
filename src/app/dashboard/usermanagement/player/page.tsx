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
import { ImBullhorn } from "react-icons/im";
import { IoMdEye } from "react-icons/io";
import { IoIosWarning } from "react-icons/io";
import { TbSquareRoundedCheckFilled } from "react-icons/tb";
import { FaCircleCheck } from "react-icons/fa6";
import { TiArrowLeftThick, TiArrowRightThick } from "react-icons/ti";
import { RiCloseFill } from "react-icons/ri";
import { FiCheck } from "react-icons/fi";


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
    daysago: string

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
  const [total, setTotal] = useState(0)
  const [today, setToday] = useState(0)
  const [index, setIndex] = useState(0)

    useEffect(() => {
    const getCountregister = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/getregistrationcount`,{
           withCredentials: true,
              headers: {
              'Content-Type': 'application/json',
                }
        })
        setTotal(response.data.data.totalusers)
        setToday(response.data.data.usersToday)
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
    getCountregister()
  },[])
  
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

    useEffect(() => {
        setCurrentpage(0)
    },[filter])

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

            if ( response.data.message == 'success'){
                setBanload(false)
                 toast({
                description: (<div className=' flex items-center gap-2'><FiCheck size={20} /><p>Player banned successfully</p></div>),
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

   const reload = async () => {
            setLoading(true)
              try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/getplayerlist?page=${currentpage}&limit=10&search=&filter=`,{
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                        }
                })
              
                setLoading(false)
                setPlayer(response.data.data.userlist)
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

    const handleBan = () => {
        ban()
        setTimeout(() => {
        reload();
    }, 1000);
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

            if ( response.data.message == 'success'){
                setBanload(false)
                 toast({
                description:(<div className=' flex items-center gap-2'><FiCheck size={20} /><p>Player unbanned successfully</p></div>),
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

    const handleUnban = () => {
        unban()
        setTimeout(() => {
        reload();
        }, 1000);
    }

    const [ title, setTitle] = useState('')
    const [ description, setDescription] = useState('')

    {/*Player Inbox*/}
   
    const playerInbox = async () => {

            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/inbox/viewplayermessage`,{
                    params:{
                        userid: userid
                    },
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                        }
                })
                setInbox(response.data.data.inbox)
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

    const handleInbox = () => {
    setTimeout(() => {
        playerInbox();
        }, 2000);
    }



    const formatISODate = (isoString: any) => {
    const date = new Date(isoString);
    const formattedDate = date.toLocaleDateString(); // Format date as per locale
    const formattedTime = date.toLocaleTimeString(); // Format time as per locale
    return `${formattedDate} ${formattedTime}`;
    };

    const [passwordold, setPasswordold] = useState('')
    const [passwordnew, setPasswordnew] = useState('password')
    const [passwordload, setPasswordload] = useState(false)

    {/*Change Password*/}
    const changePassword = async () => {
        setPasswordload(true)
        if (passwordnew === ''){
            setPasswordload(false)
            toast({
                variant:"destructive",
                title: "Failed",
                  description: "Enter password password",
            })
        } else{
            try {
                const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/user/changeplayerpasswordadmin`,{
                     userid: userid,
                    newpw: passwordnew
                },{
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
                if (response.data.message === 'success'){
                    setPasswordload(false)
                    setPasswordold('')
                    toast({
                    description: (<div className=' flex items-center gap-2'><FiCheck size={20} /><p>Password changed successfully</p></div>),
                })
                }

                 if (response.data.message === 'failed'){
                    setPasswordload(false)
                    setPasswordold('')
                    toast({
                    variant: 'destructive',
                    description: (<div className=' flex items-center gap-2'><RiCloseFill size={20} /><p>Theres a problem changing the password</p></div>),
                })
                }
            } catch (error) {
            setPasswordload(false)
                if (axios.isAxiosError(error)) {
                    const axiosError = error as AxiosError;
                    if (axiosError.response && axiosError.response.status === 401) {
                        localStorage.setItem('auth', 'false');
                        router.push('/')
                        toast({
                        variant: "destructive",
                        title: "Unauthorized",
                        })
                
                    }
                } 
                
            }
        }
    }

    const [inventory, setInventory] = useState('skin')

  return (
    <div className=' flex w-full h-screen overflow-x-hidden'>
        <Sidebar/>
        <main className=' w-full text-white h-auto overflow-y-auto'
        style={{backgroundImage: "url('/dashboard/assets/BG.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat:"no-repeat"}}
        
        >
           <Header/>

         
            <div className=' flex flex-col gap-8 w-full p-4 md:p-8'>

                <div className=' relative w-full h-[180px] rounded-lg flex items-end p-6 shadow-lg border-[1px] border-opacity-50 border-orange-300'
                style={{backgroundImage: "url('/dashboard/assets/Tab.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat:"no-repeat"}}

                >
                    <div className=' absolute top-0 left-0 w-full h-full bg-gradient-to-r from-[#000000] to-[#00000000] rounded-lg'>

                    </div>
                    <h2 className=' relative z-10 text-2xl font-bold text-secondary'>Manage Players</h2>

                </div>     

                {/* <div className=' grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4'>

                    <div className=' flex flex-col gap-5 items-center justify-center w-full h-[180px] rounded-lg bg-zinc-950 p-4'>
                        <BsPersonPlusFill size={30} className=' text-secondary'/>

                        <div className=' flex flex-col gap-2 items-center p-2'>
                            <p className=' text-xl font-semibold'>{total}</p>
                            <p className=' text-xs text-zinc-200'>Total Joinings</p>

                        </div>
                    </div>

                    <div className=' flex flex-col gap-5 items-center justify-center w-full h-[180px] rounded-lg bg-zinc-950 p-4'>
                        <FaUsers size={30} className=' text-secondary'/>
                        

                        <div className=' flex flex-col gap-2 items-center p-2'>
                            <p className=' text-xl font-semibold'>{today}</p>
                            <p className=' text-xs text-zinc-200'>Todays Joinings</p>

                        </div>
                    </div>

                </div> */}

                <div className=' grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 xl:grid-cols-3 gap-4 mt-4'>

                    <div className=' flex items-center gap-5 w-full h-[150px] rounded-lg bg-zinc-950 p-4'
                    style={{backgroundImage: "url('/dashboard/assets/TAB A.png')", backgroundSize: "cover", backgroundPosition: "left", backgroundRepeat:"no-repeat"}}
                    
                    >
                        {/* <BsPersonPlusFill size={30} className=' text-secondary'/> */}
                        <div className=' w-[60%] lg:w-[70%]'>

                        </div>

                        <div className=' flex flex-col h-full w-full gap-2 items-center justify-center p-2'>
                            <p className=' text-2xl lg:text-4xl font-bold text-amber-950'>{total}</p>
                            <p className=' text-xs lg:text-sm font-semibold text-amber-900'>Total Joinings</p>

                        </div>
                    </div>

                    <div className=' flex items-center gap-5 w-full h-[150px] rounded-lg bg-zinc-950 p-4'
                    style={{backgroundImage: "url('/dashboard/assets/TAB A.png')", backgroundSize: "cover", backgroundPosition: "left", backgroundRepeat:"no-repeat"}}
                    
                    >
                        <div className='  w-[60%] lg:w-[70%]'>

                        </div>

                        <div className=' flex flex-col w-full gap-2 items-center justify-center p-2'>
                            <p className=' text-2xl lg:text-4xl font-semibold text-amber-950'>{today}</p>
                            <p className=' text-xs lg:text-sm text-amber-900'>Todays Joinings</p>

                        </div>
                    </div>

                </div>

                <div className=' flex flex-col lg:flex-row items-center gap-4'>
                     <div className=' flex items-center gap-2'>
                        <Input placeholder='Search by username or email' value={search} onChange={(e) => setSearch(e.target.value)} type='text' className=' bg-zinc-950 border-2 border-orange-300 border-opacity-50 w-[200px] lg:w-[300px]'/>
                        <button
                        onClick={searchByusername}
                        className=' h-10 w-[120px] md:w-[150px] text-sm font-bold text-amber-950 hover:scale-105 ease-in-out duration-200 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-300 to-orange-400 rounded-md'
                        >
                       
                            Search</button>
                    </div>

                   

                    <div className=' flex items-center gap-4'>
                        <Select onValueChange={setFilter} value={filter}>
                        <SelectTrigger className="w-[180px] bg-zinc-950 border-2 border-orange-300 border-opacity-50">
                            <SelectValue placeholder="Filter" />
                        </SelectTrigger>
                        <SelectContent className=' bg-zinc-950 border-none cursor-pointer'>
                            <SelectItem value='active' className=' hover:bg-none text-white cursor-pointer'>Active</SelectItem>
                            <SelectItem value='inactive' className=' hover:bg-none text-white cursor-pointer'>Banned</SelectItem>
                        </SelectContent>
                        </Select>

                    <button onClick={reset} className=' px-4 py-2 bg-gradient-to-tr from-orange-200 to-orange-400 text-zinc-950 rounded-md'><HiRefresh size={20}/></button>

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
                    <div className=' p-2 border-[1px] border-orange-300 border-opacity-20'>
                    <Table className=' '>
                    <TableHeader className=' bg-amber-800 border-b-2 border-orange-300 text-white'>
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
                            <TableCell className=' flex items-center justify-start gap-2'>
 
                                <Dialog onOpenChange={() => setTab('dashboard')}>
                                <DialogTrigger onClick={() => {setUserid(list.id)}}>
                                    <button className=' bg-blue-100 px-2 py-1 rounded-sm text-xs flex items-center gap-1 text-blue-950'><IoMdEye size={15}/>View</button>
                                </DialogTrigger>
                                <DialogContent className=' flex flex-col items-start border-x-8 border-orange-300 w-[90%] h-[600px] md:w-[800px] rounded-md '
                                style={{backgroundImage: "url('/userdashboard/Assets/TAB HOLDER big.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat:"no-repeat"}}

                                >
                                    <Popover>
                                    <PopoverTrigger className=' block md:hidden text-white bg-zinc-900 p-2 rounded-md text-xs'>Menu</PopoverTrigger>
                                    <PopoverContent className=' ml-10 bg-zinc-950 border-zinc-900 text-white w-[180px]'>
                                        <p onClick={()=> setTab('dashboard')} className={`text-xs px-4 py-1 cursor-default ${tab === 'dashboard' && ' bg-secondary rounded-md'}`}>Dashboard</p>
                                        <p onClick={()=> setTab('inventory')} className={`text-xs px-4 py-1 cursor-default ${tab === 'inventory' && ' bg-secondary rounded-md'}`}> Inventory</p>
                                        <p onClick={()=> setTab('transaction')} className={`text-xs px-4 py-1 cursor-default ${tab === 'transaction' && ' bg-secondary rounded-md'}`}>Transaction history</p>
                                        <p onClick={()=> {setTab('inbox'); playerInbox()}} className={`text-xs px-4 py-1 cursor-default ${tab === 'inbox' && ' bg-secondary rounded-md'}`}>Inbox</p>
                                        <p onClick={()=> setTab('profile')} className={`text-xs px-4 py-1 cursor-default ${tab === 'profile' && ' bg-secondary rounded-md'}`}>Profile</p>
                                    </PopoverContent>
                                    </Popover>

                                    <div className=' hidden md:flex items-center gap-2 justify-center text-white'>
                                        <p onClick={()=> setTab('dashboard')} className={`text-sm font-semibold border-[1px] border-opacity-30 border-orange-300 rounded-md px-4 py-1 cursor-pointer ${tab === 'dashboard' && ' text-amber-950 bg-gradient-to-r from-orange-200 to-orange-400 rounded-md'}`}>DASHBOARD</p>
                                        <p onClick={()=> setTab('inventory')} className={`text-sm font-semibold border-[1px] border-opacity-30 border-orange-300 rounded-md px-4 py-1 cursor-pointer ${tab === 'inventory' && ' text-amber-950 bg-gradient-to-r from-orange-200 to-orange-400 rounded-md'}`}>INVENTORY</p>
                                        <p onClick={()=> setTab('transaction')} className={`text-sm font-semibold border-[1px] border-opacity-30 border-orange-300 rounded-md px-4 py-1 cursor-pointer ${tab === 'transaction' && ' text-amber-950 bg-gradient-to-r from-orange-200 to-orange-400 rounded-md'}`}>TRANSACTION</p>
                                        <p onClick={()=> {setTab('inbox'); playerInbox()}} className={`text-sm font-semibold border-[1px] border-opacity-30 border-orange-300 rounded-md px-4 py-1 cursor-pointer ${tab === 'inbox' && ' text-amber-950 bg-gradient-to-r from-orange-200 to-orange-400 rounded-md'}`}>INBOX</p>
                                        <p onClick={()=> setTab('profile')} className={`text-sm font-semibold border-[1px] border-opacity-30 border-orange-300 rounded-md px-4 py-1 cursor-pointer ${tab === 'profile' && 'text-amber-950 bg-gradient-to-r from-orange-200 to-orange-400 rounded-md'}`}>PROFILE</p>

                                    </div>
                                    {tab === 'dashboard' && (
                                        <div className=' relative w-full h-full rounded-lg flex items-start p-6'
                                        style={{backgroundImage: "url('/userdashboard/Assets/TAB HOLDER small.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat:"no-repeat"}}
                                        >

                                        <img src="/userdashboard/Assets/Character B.png" alt="" width={350} className=' absolute bottom-2 right-0 z-20 md:block hidden' />
                                         <img src="/userdashboard/Assets/Character A.png" alt="" width={450} className=' absolute bottom-2 right-0 md:block hidden' />
                                        <div className=' relative z-30 flex flex-col gap-4 md:w-[40%] w-full'>

                                            <div className=' flex items-end justify-end h-[100px] md:h-[120px]'
                                            style={{backgroundImage: "url('/userdashboard/Assets/TAB A.png')", backgroundSize: "cover", backgroundPosition: "left", backgroundRepeat:"no-repeat"}}
                                            >

                                                <div className=' flex flex-col items-center justify-center gap-2 w-[60%] h-full'>
                                                    <h2 className=' text-amber-950 text-xl font-semibold'>0</h2>
                                                    <p className=' text-sm text-amber-950'>Total Kills</p>

                                                </div>

                                            </div>

                                            <div className=' flex items-end justify-end h-[100px] md:h-[120px]'
                                            style={{backgroundImage: "url('/userdashboard/Assets/TAB B.png')", backgroundSize: "cover", backgroundPosition: "left", backgroundRepeat:"no-repeat"}}
                                            >

                                                <div className=' flex flex-col items-center justify-center gap-2 w-[60%] h-full'>
                                                    <h2 className=' text-amber-950 text-xl font-semibold'>0</h2>
                                                    <p className=' text-sm text-amber-950'>Total Deaths</p>

                                                </div>

                                            </div>

                                             <div className=' flex items-end justify-end h-[100px] md:h-[120px]'
                                            style={{backgroundImage: "url('/userdashboard/Assets/TAB C.png')", backgroundSize: "cover", backgroundPosition: "left", backgroundRepeat:"no-repeat"}}
                                            >

                                                <div className=' flex flex-col items-center justify-center gap-2 w-[60%] h-full'>
                                                    <h2 className=' text-amber-950 text-xl font-semibold'>0</h2>
                                                    <p className=' text-sm text-amber-950'>Current Rank</p>

                                                </div>

                                            </div>

                                        </div>
                                        </div>
                                    )}

                                     {tab === 'inventory' && (
                                        <div className=' relative w-full h-full rounded-lg flex flex-col gap-6 items-start p-4'
                                        style={{backgroundImage: "url('/userdashboard/Assets/TAB HOLDER small.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat:"no-repeat"}}
                                        
                                        >

                                            <div className=' hidden w-full bg-amber-900 md:grid grid-cols-4 p-2'>
                                                <p onClick={() => setInventory('skin')} className={`w-full text-lg text-center border-r-4 border-amber-950 cursor-pointer ${inventory === 'skin' ? ' text-orange-300' : ' text-orange-100'}`}>SKIN</p>

                                                 <p onClick={() => setInventory('color')} className={`w-full text-lg text-center border-r-4 border-amber-950 cursor-pointer ${inventory === 'color' ? ' text-orange-300' : ' text-orange-100'}`}>COLOR</p>

                                                  <p onClick={() => setInventory('effects')} className={`w-full text-lg text-center border-r-4 border-amber-950 cursor-pointer ${inventory === 'effects' ? ' text-orange-300' : ' text-orange-100'}`}>EFFECTS</p>

                                                   <p onClick={() => setInventory('misc')} className={`w-full text-lg text-center cursor-pointer ${inventory === 'misc' ? ' text-orange-300' : ' text-orange-100'}`}>MISC</p>
                                            

                                            </div>

                                            <Select>
                                            <SelectTrigger className=" visible md:hidden bg-zinc-950 border-2 border-orange-300 border-opacity-30 text-orange-100">
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent className=' bg-zinc-950 border-orange-300 border-opacity-30 text-orange-100'>
                                                <SelectItem value="skin" className=' cursor-pointer'>SKIN</SelectItem>
                                                <SelectItem value="color" className=' cursor-pointer'>COLOR</SelectItem>
                                                <SelectItem value="effects" className=' cursor-pointer'>EFFECTS</SelectItem>
                                                <SelectItem value="misc" className=' cursor-pointer'>MISC</SelectItem>
                                            </SelectContent>
                                            </Select>

                                            <div className=' grid grid-cols-3 md:grid-cols-5 w-full h-[75%] overflow-y-auto gap-4'>

                                                <div className=' aspect-square bg-gradient-to-b from-amber-950 to-amber-900 border-2 border-orange-300 border-opacity-50'>

                                                </div>

                                                 <div className=' aspect-square bg-gradient-to-b from-amber-950 to-amber-900 border-2 border-orange-300 border-opacity-50'>

                                                </div>

                                                 <div className=' aspect-square bg-gradient-to-b from-amber-950 to-amber-900 border-2 border-orange-300 border-opacity-50'>

                                                </div>

                                                 <div className=' aspect-square bg-gradient-to-b from-amber-950 to-amber-900 border-2 border-orange-300 border-opacity-50'>

                                                </div>

                                                 <div className=' aspect-square bg-gradient-to-b from-amber-950 to-amber-900 border-2 border-orange-300 border-opacity-50'>

                                                </div>

                                                <div className=' aspect-square bg-gradient-to-b from-amber-950 to-amber-900 border-2 border-orange-300 border-opacity-50'>

                                                </div>

                                                 <div className=' aspect-square bg-gradient-to-b from-amber-950 to-amber-900 border-2 border-orange-300 border-opacity-50'>

                                                </div>

                                                 <div className=' aspect-square bg-gradient-to-b from-amber-950 to-amber-900 border-2 border-orange-300 border-opacity-50'>

                                                </div>

                                                 <div className=' aspect-square bg-gradient-to-b from-amber-950 to-amber-900 border-2 border-orange-300 border-opacity-50'>

                                                </div>

                                                 <div className=' aspect-square bg-gradient-to-b from-amber-950 to-amber-900 border-2 border-orange-300 border-opacity-50'>

                                                </div>

                                                 

                                            </div>

                                            <div className=' absolute bottom-4 right-4 flex items-center gap-4'>
                                                <button 
                                             
                                                className=' bg-gradient-to-r from-orange-200 to-orange-400 rounded-md text-amber-950 px-6'><TiArrowLeftThick size={30}/></button>
                                                {/* <p className=' text-sm font-bold bg-zinc-950 px-4 py-2 text-center  rounded-md'>{currentpage + 1}</p> */}
                                                <button
                                               
                                                className='bg-gradient-to-r from-orange-200 to-orange-400 rounded-md text-amber-950 px-6'><TiArrowRightThick size={30}/></button>

                                            </div>
                                        </div>
                                    )}

                                    {tab === 'transaction' && (
                                        <div className=' bg-zinc-900 w-full h-full rounded-lg flex items-center justify-center'
                                        style={{backgroundImage: "url('/userdashboard/Assets/TAB HOLDER small.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat:"no-repeat"}}
                                        
                                        >
                                            <p className=' text-xs text-zinc-300'>Coming Soon!</p>
                                        </div>
                                    )}

                                    {tab === 'inbox' && (
                                        <div className=' flex flex-col items-start justify-start w-full h-[90%]'>

                                            <div className=' md:hidden w-full h-full flex flex-col items-start justify-start gap-2 text-white overflow-y-auto overflow-x-hidden '>
                                             { inbox.map((list, idx)=>(
                                                   
                                                    <Dialog>
                                                        <DialogTrigger className=' w-full '>
                                                            <div 
                                                            onClick={() =>{setTitle(list.title); setDescription(list.description); setActive(list.title)}}
                                                            key={idx} 
                                                            className={`flex items-center justify-between gap-4 w-full rounded-lg text-white border-4 p-3 overflow-hidden ${active === list.title ? ' border-orange-400' : 'border-orange-300'}`}
                                                            style={{backgroundImage: "url('/inbox/Assets/Tab small.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat:"no-repeat"}}
                                                                >
                                                                    <ImBullhorn size={30}/>

                                                                    <div className=' flex flex-col items-start h-[70px] w-[55%] gap-1 overflow-hidden'>
                                                                        <p className=' text-xs font-semibold line-clamp-1'>{list.title}</p>
                                                                        <p className=' text-[.6em] line-clamp-2 text-zinc-400'>{list.description}</p>
                                                                        
                                                                        <p className=' text-[.5em] text-zinc-400'>From: Dev Team</p>
                                                                    </div>

                                                                    <div className=' flex flex-col items-end justify-end gap-2 w-[50px]'>
                                                                        <p className=' text-[.6em] text-zinc-400'>4 days ago</p>
                                                                    </div>

                                                            </div>
                                                        </DialogTrigger>
                                                        <DialogContent className=' w-[90%] border-4 border-orange-300 rounded-md'
                                                        style={{backgroundImage: "url('/inbox/Assets/Tab Big.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat:"no-repeat"}}
                                                        >
                                                           

                                                            <DialogHeader>
                                                            <DialogTitle className=' text-orange-100 text-start'>{title}</DialogTitle>
                                                            <DialogDescription className=' text-start h-[300px] overflow-y-auto'>
                                                            {description}
                                                            </DialogDescription>
                                                            </DialogHeader>
                                                        </DialogContent>
                                                        </Dialog>
                                                ))}
                                                    

                                            </div>
                                      

                                        </div>
                                    )}

                                    {tab === 'inbox' && (
                                        <div className=' hidden relative w-full h-[480px] rounded-lg md:flex flex-col gap-2 items-center p-6'
                                        style={{backgroundImage: "url('/userdashboard/Assets/TAB HOLDER small.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat:"no-repeat"}}
                                         
                                        >
                                        <div className=' w-full h-full grid grid-cols-2 place-items-start gap-4'>

                                              <div className=' w-full h-[420px] text-white p-4 border-4 border-orange-300 rounded-md'
                                                style={{backgroundImage: "url('/inbox/Assets/Tab Big.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat:"no-repeat"}}

                                                 >
                                                   
                                                    <p className=' text-sm font-semibold mt-4'>{title}</p>
                                                    <div className=' w-full overflow-y-auto overflow-x-hidden h-[80%] mt-2'>
                                                        <p className=' text-xs text-zinc-200 '>{description}</p>

                                                    </div>

                                                </div>

                                                <div className=' flex flex-col items-start gap-1 w-full h-full overflow-y-auto'>

                                                    { inbox.map((list, idx)=>(
                                                        <div 
                                                        onClick={() =>{setTitle(list.title); setDescription(list.description); setActive(list.title)}}
                                                        key={idx} 
                                                        className={`flex items-center justify-between gap-4 w-full rounded-lg text-white border-4 p-3 cursor-pointer ${active === list.title ? ' border-orange-400' : 'border-orange-300'}`}
                                                       style={{backgroundImage: "url('/inbox/Assets/Tab small.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat:"no-repeat"}}
                                                        >
                                                            <ImBullhorn size={30}/>

                                                            <div className=' flex flex-col items-start h-[70px] w-[50%] gap-1 p-2 overflow-hidden'>
                                                                <p className=' text-xs font-semibold line-clamp-1'>{list.title}</p>
                                                                <p className=' text-[.6em] line-clamp-2 text-zinc-400'>{list.description}</p>
                                                                
                                                                <p className=' text-[.5em] text-zinc-400'>From: Dev Team</p>
                                                            </div>

                                                            <div className=' flex flex-col items-end justify-end gap-2 w-[70px]'>
                                                                <p className=' text-[.6em] text-zinc-400'>{list.daysago}</p>
                                                            </div>

                                                        </div>
                                                    ))}
                                                    
                                                </div>

                                               

                                            </div>

                                          
                                            
                                        </div>
                                    )}

                                    {tab === 'profile' && (
                                        <div className=' w-full h-[600px] overflow-y-auto rounded-lg flex flex-col gap-2 items-center justify-center p-2 '
                                        style={{backgroundImage: "url('/userdashboard/Assets/TAB HOLDER small.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat:"no-repeat"}}
                                        
                                        >
                                           
                                            <div className=' flex flex-row items-center gap-2 bg-zinc-950 p-2 md:p-4 rounded-lg w-[90%] border-[1px] border-orange-300 border-opacity-30 '
                                            style={{backgroundImage: "url('/profile/Assets/Tab A.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat:"no-repeat"}}
                                            
                                            >
                                                <div className=' w-16 h-16 rounded-lg flex items-center justify-center'>
                                                    <img src="/logo 06 B.png" alt="" width={100} height={100} />
                                                </div>
                                                <div className=' flex flex-col items-start md:items-start gap-1'>
                                                    <p className=' text-sm font-semibold text-zinc-100'>{list.username}</p>
                                                    <p className=' text-xs text-zinc-300'>{list.id}</p>
                                                </div>
                                            </div>

                                            <div className=' flex flex-col md:flex-row items-center gap-2 bg-zinc-950 p-2 md:p-4 rounded-lg w-[90%] border-[1px] border-orange-300 border-opacity-30 '
                                             style={{backgroundImage: "url('/profile/Assets/Tab B.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat:"no-repeat"}}
                                            >
                                                <Input placeholder='Password' onChange={(e) => setPasswordnew(e.target.value)} type='password' value={passwordnew} className=' bg-zinc-950 border-none text-white'/>

                                                <button
                                                
                                                className=' flex items-center justify-center gap-2 w-[200px] py-2 rounded-md text-sm font-bold text-amber-950 bg-gradient-to-r from-orange-200 to-orange-400 hover:scale-110 ease-in-out duration-200 '
                                                onClick={changePassword}
                                                >

                                                { passwordload ? (
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
                                                ) : (
                                                    <p> Change Password</p>
                                                )} 
                                               </button>
                                            </div>

                                            <div className=' flex flex-col justify-start md:flex-row items-center md:justify-between gap-4 bg-zinc-950 p-2 md:p-4 rounded-lg w-[90%] border-[1px] border-orange-300 border-opacity-30 '
                                            style={{backgroundImage: "url('/profile/Assets/Tab C.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat:"no-repeat"}}
                                            >
                                                <div className=' flex flex-col items-start gap-4 w-full'>
                                                    <div className=' flex flex-col w-full bg-zinc-950 p-2 rounded-md'>
                                                        <p className=' text-xs text-zinc-400'>Email:</p>
                                                        <p className=' text-sm text-zinc-100'>{list.email}</p>
                                                    </div>
                                                    <div className=' flex flex-col w-full bg-zinc-950 p-2 rounded-md'>
                                                        <p className=' text-xs text-zinc-400'>Country:</p>
                                                        <p className=' text-sm text-zinc-100'>{list.country}</p>
                                                    </div>

                                                </div>

                                                <div className=' flex flex-col items-start gap-4 w-full'>
                                                    <div className=' flex flex-col w-full bg-zinc-950 p-2 rounded-md'>
                                                        <p className=' text-xs text-zinc-400'>Status:</p>
                                                        <p className={`text-sm ${list.status === 'active' && ' text-green-500'} ${list.status === 'inactive' && ' text-red-500'}`}>{list.status}</p>
                                                    </div>
                                                    <div className=' flex flex-col w-full bg-zinc-950 p-2 rounded-md'>
                                                        <p className=' text-xs text-zinc-400'>Account Creation:</p>
                                                        <p className=' text-sm text-zinc-100'>{formatISODate(list.createdAt)}</p>
                                                    </div>

                                                </div>
                                            </div>
                                       
                                        </div>
                                    )}
                                    
                                </DialogContent>
                                </Dialog>

                                <AlertDialog>
                                     { list.status === 'inactive' && (
                                    <AlertDialogTrigger>
                                        <button 
                                        onClick={() => {setStatus(list.status); setId(list.id)}}
                                        className=' text-xs px-2 py-1 bg-green-600 rounded-md flex items-center gap-1'><TbSquareRoundedCheckFilled size={15}/>UnBan</button>
                                    </AlertDialogTrigger>

                                    )}
                                <AlertDialogContent className=' w-[90%] md:w-[full] bg-zinc-950 border-zinc-900'>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle className=' text-secondary'>Are you absolutely sure to unban this player?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will temporarily unbanned the player account.
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel className=' bg-zinc-900 border-none text-white'>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleUnban} className=' flex items-center justify-center gap-2 bg-red-600'>
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
                                    { list.status === 'active' && (
                                    <AlertDialogTrigger>

                                        <button 
                                        onClick={() => {setStatus(list.status); setId(list.id)}}
                                        className=' text-xs px-4 py-1 bg-red-800 text-red-200 font-semibold rounded-sm flex items-center gap-1'><IoIosWarning size={15}/>Ban</button>
                                    </AlertDialogTrigger>

                                    )}
                                <AlertDialogContent className=' w-[90%] md:w-full bg-zinc-950 border-zinc-900'>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle className=' text-secondary'>Are you absolutely sure to ban this player?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will temporarily banned the player account.
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel className=' bg-zinc-900 border-none text-white hover:bg-zinc-800 hover:text-white'>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleBan} className=' flex items-center justify-center gap-2 bg-red-600 text-white hover:bg-red-800'>
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
                    </div>
                )}
              

                <div className=' flex items-center justify-end gap-4'>
                    <button 
                    onClick={() => setCurrentpage( currentpage - 1)}
                    disabled={loading ? true : currentpage === 0} 
                   className=' cursor-pointer bg-gradient-to-r from-orange-200 to-orange-400 rounded-md text-amber-950 px-6'><TiArrowLeftThick size={30}/></button>
                    {/* <p className=' text-sm font-bold bg-zinc-950 px-4 py-2 text-center  rounded-md'>{currentpage + 1}</p> */}
                    <button
                      onClick={() => setCurrentpage(currentpage + 1)}
                    disabled={ loading ? true :  currentpage + 1 === totalpages}
                    className=' cursor-pointer bg-gradient-to-r from-orange-200 to-orange-400 rounded-md text-amber-950 px-6'><TiArrowRightThick size={30}/></button>

                </div>

               
            </div>
             
        </main>
      

    </div>
  )
}
