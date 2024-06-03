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


interface News {
    banner: string
description: string
newsid: string
title: string

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
            console.log(selectedFile);
        }
    }, [selectedFile]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleImageChange(e);
    handleFileChange(e);
  };

    const createNews = async () => {
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

        if( selectedImage === null){
        setLoading(false)
             toast({
            variant: "destructive",
            title: "Please add an image",
            })
        }
        if(selectedImage !== null && title !== '' && description !== ''){
            try {
                const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/news/createnews`,{
                    title: title,
                    description: description,
                    bannerimg: selectedFile
                },{
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        }
                })
                console.log(response.data)
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
                console.log(response.data)
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
    const [ edit, setEdit] = useState(true)
    const [ check, setCheck] = useState(false)
    const [editTitle, setEditTitle] = useState('')
    const [editdescription, setEditDescription] = useState('')
    const [id, setId] = useState('')
    const [editload, setEditLoad] = useState(false)

    {/*News List*/}
    useEffect(() =>{
        const news = async () => {
            setListload(true)
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/news/getnewslist?page=${currentpage}&limit=10`,{
                     withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                        }
                })
                setListload(false)
                setTotalPages(response.data.data.totalpages)
                setNews(response.data.data.news)
                console.log('List',response.data)
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
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/news/getnewslist?page=${currentpage}&limit=10`,{
                     withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                        }
                })
                setListload(false)
                setTotalPages(response.data.data.totalpages)
                setNews(response.data.data.news)
                console.log('List',response.data)
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
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/news/editnews`,{
                newsid: id,
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
            console.log(response.data)
            if ( response.data.message) {
                 toast({
                title: 'Success',
                description: `News updated successfully`
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
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/news/deletenews?newsid=${id}`,{
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    }
            })
            console.log(response.data)
             if ( response.data.message) {
                 toast({
                title: 'Success',
                description: `News deleted successfully`
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

     const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMass(e.target.checked);
  };

    const handleEdit = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCheck(e.target.checked);
    if ( check === true){
        setEdit(false)
    }else{
        setEdit(true)
    }
  };
    
  return (
    <div className=' flex w-full'>
        <Sidebar/>
        <main className=' bg-zinc-900 h-screen  overflow-y-auto w-full text-white'>
           <Header/>

            <div className=' flex flex-col gap-8 w-full p-4 md:p-8'>     
                <div className=' flex items-center gap-4'>
                    
                    <div className=' flex items-center gap-2'>
                        
                        <Dialog>
                        <DialogTrigger>
                            <button
                            style={{backgroundImage: "url('/button.png')", backgroundSize: "contain", backgroundPosition: "center", backgroundRepeat:"no-repeat"}}
                            className=' h-10 w-[220px] text-xs font-bold text-amber-950 hover:scale-105 ease-in-out duration-200 flex items-center justify-center gap-2'
                            >Add News</button>
                        </DialogTrigger>
                        <DialogContent className=' w-[90%] md:w-[500px] h-auto bg-zinc-950 border-zinc-900 text-white'>
                           <div className=' w-full h-full md:p-4'>
                            <p className=' text-lg font-semibold text-secondary'>News Information</p>

                            <div className=' grid grid-cols-2 gap-1 md:gap-4 mt-6'>
                                <div className=' flex flex-col'>
                                    <div className=' w-[80%] h-[150px] rounded-md bg-zinc-900'>
                                        <img src={selectedImage as string} alt="" />

                                    </div>
                                    <input type="file" accept="image/*" onChange={handleChange} className=' text-xs mt-4' />

                                </div>

                                <div className=' flex flex-col gap-2'>
                                    <Input placeholder='Title' value={title} onChange={(e) => setTitle(e.target.value)} type='text' className=' bg-zinc-900 border-none'/>
                                    <Textarea value={description}  onChange={(e) => setDescription(e.target.value)} placeholder='Description' className=' bg-zinc-900 border-none'/>
                                    <div className=' flex items-center gap-2'>
                                        <input
                                        type="checkbox"
                                        checked={mass}
                                        onChange={handleCheckboxChange}
                                        />
                                        <p className=' text-xs text-zinc-300'>Send message to all players</p>
                                    </div>
                                </div>

                            </div>

                          

                            <div className=' w-full flex items-center justify-center mt-8'>
                                <button
                                onClick={handleNews}
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
                                    Add news</button>
                            </div>

                            
                           </div>
                        </DialogContent>
                        </Dialog>

                        <button onClick={refresh} className=' p-2 bg-secondary rounded-md'><HiRefresh size={20}/></button>

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
                    <TableHeader className=' bg-zinc-950 hover:bg-zinc-950 text-white'>
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
                                    <button className=' text-xs px-2 py-1 bg-blue-800 rounded-md'>View</button>
                                </TableCell>
                            </DialogTrigger>
                            <DialogContent className=' w-[40%] h-auto p-10 flex items-center justify-center bg-zinc-950 border-zinc-900'>
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
                                        className=' text-xs px-2 py-1 bg-blue-800 rounded-md'>View</button>
                                    </TableCell>
                                </DialogTrigger>
                                <DialogContent className=' flex-col w-[40%] h-auto p-10 flex items-center justify-center bg-zinc-950 border-zinc-900 text-white'>
                                   
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
                                    <Textarea onChange={(e) => setEditDescription(e.target.value)} disabled={edit} value={editdescription} placeholder='Description' className=' bg-zinc-900 border-none'/>
                                    <div className=' w-full flex items-start gap-2'>
                                       <input
                                        type="checkbox"
                                        onChange={handleEdit}
                                        />
                                        <p className=' text-xs text-zinc-300'>Edit news</p>
                                    </div>

                                    <div className=' w-full flex items-center justify-end gap-4 mt-4'>
                                        <button onClick={editNews} className=' px-4 py-2 bg-secondary rounded-lg flex items-center justify-center gap-2'>
                                            { editload === true && (
                                                <>
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
                                                </>
                                            )}
                                            Save Changes</button>
                                    </div>
                                   
                                </DialogContent>
                                </Dialog>

                                <AlertDialog>
                                <AlertDialogTrigger>
                                    <button onClick={() => setId(list.newsid)} className=' text-xs px-2 py-1 bg-red-600 rounded-md'>Delete</button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className=' bg-zinc-950 border-zinc-900 text-white'>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete news data
                                        and remove the data from the server. <p className=' text-sm text-red-600'>{list.newsid}</p>
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel className=' bg-zinc-900 border-none'>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={deleteNews} className=' bg-red-600 text-white'>Continue</AlertDialogAction>
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
                
              

                <div className=' flex items-center justify-center gap-4'>
                    <button 
                    onClick={() => setCurrentpage( currentpage - 1)}
                    disabled={loading ? true : currentpage === 0} 
                   className=' text-secondary'><MdOutlineKeyboardArrowLeft size={40}/></button>
                    <p className=' text-lg font-bold bg-zinc-950 px-4 py-2 text-center  rounded-md'>{currentpage + 1}</p>
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
