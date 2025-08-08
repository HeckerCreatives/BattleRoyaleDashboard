"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import api from "@/lib/axios"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { EditSeasonDialog } from "./EditSeasonDialog"
import { CreateSeasonDialog } from "./CreateSeasonDialog"
import { ConfirmDialog } from "./ConfirmDialog"
import axios, { AxiosError } from "axios"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { CreateTitleDialog } from "./CreateTitel"
import { TiArrowLeftThick, TiArrowRightThick } from "react-icons/ti"
import { DeleteTitleDialog } from "./DeleteTitle"
import { EditTitleDialog } from "./EditTitle"


export interface TitleItemData {
  id: string
  index: number
  name: string
  description: string
  createdAt: string
  updatedAt: string
}

export interface Pagination {
  totalCount: number
  totalPages: number
  currentPage: number
  pageSize: number
}

export interface ApiResponse {
  message: string
  data: TitleItemData[]
  pagination: Pagination
}




export function TitlesSection() {
  const [list, setList] = useState<TitleItemData[]>([])
  const [search, setSearch] = useState('')
   const [ totalpages, setTotalPages] = useState(0)
    const [ currentpage, setCurrentpage] = useState<number>(0)
    const [loading, setLoading] = useState(false)
    
    const router = useRouter()
 

  const fetchData = async () => {
    const res = await api.get(`/title/list?page=${currentpage}&limit=10&search=${search}`)
    setList(res.data.data)
    setTotalPages(res.data.pagination.totalPages)
  }


 useEffect(() => {
    const handler = setTimeout(() => {
      fetchData();
    }, 500);
    return () => {
      clearTimeout(handler);
    };
  }, [currentpage, search]);

  const handleDelete = async (id: string) => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/title/delete`, 
        { id: id },
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' },
        }
      )

      toast({
        variant: "default",
        title: "Title deleted",
        description: "Title has been successfully removed.",
        duration: 2000
      })

      fetchData()
    } catch (error) {
      handleSeasonError(error)
    }
  }

    const handleSeasonError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string; data: string }>
        const status = axiosError.response?.status
        const message = axiosError.response?.data.message
        const description = axiosError.response?.data.data

        if (status === 401) {
        router.push("/")
        }

        toast({
        variant: "destructive",
        title: message || "Error",
        description: description || "Something went wrong.",
        })
    }

    }

  return (
    <section>
      <h2 className="text-xl font-bold mb-4">Titles</h2>

      <div className=" flex items-center gap-4 flex-wrap">
      <CreateTitleDialog onSave={fetchData} />
      <Input className=" w-fit text-black" value={search} onChange={(e) => setSearch(e.target.value)} placeholder='Search...'/>

      </div>

     <Table className=" mt-4">
                <TableHeader>
                <TableRow className=" border-b border-zinc-600">
                    <TableHead className=" text-start">Title Index</TableHead>
                    <TableHead className=" text-start">Title Name</TableHead>
                    <TableHead className=" text-start">Description</TableHead>
                    <TableHead className=" text-start">Action</TableHead>
                </TableRow>
                </TableHeader>
               <TableBody>
            {list?.map((entry, index) => (
                <TableRow key={index}>
                <TableCell className=" text-left">{entry.index}</TableCell>
                <TableCell className=" text-left">{entry.name}</TableCell>
                <TableCell className=" text-left">{entry.description}</TableCell>
           

                <TableCell className="text-left">
                    <div className="flex gap-2 flex-wrap items-center">
                    <EditTitleDialog data={entry} onSave={fetchData} />

                   

                    <DeleteTitleDialog
                        title="Delete Title"
                        description={`Are you sure you want to delete "${entry.name}"? This action is permanent.`}
                        confirmLabel="Delete"
                        danger
                        onConfirm={() => handleDelete(entry.id)}
                        trigger={<Button variant="destructive" size="sm">Delete</Button>}
                    />
                    </div>
                </TableCell>
                </TableRow>
            ))}
            </TableBody>

                </Table>

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

    </section>
  )
}
