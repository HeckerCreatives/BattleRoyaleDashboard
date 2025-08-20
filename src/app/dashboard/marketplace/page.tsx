"use client"

import { useEffect, useState } from "react"
import api from "@/lib/axios"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell, TableCaption } from "@/components/ui/table"
import axios, { AxiosError } from "axios"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { TiArrowLeftThick, TiArrowRightThick } from "react-icons/ti"
import Sidebar from "@/components/Sidebar"
import Header from "@/components/Header"
import { MarketplaceItem, MarketplaceItemDialog } from "./AddItem"
import { EditItemDialog } from "./EditItem"
import { DeleteItemDialog } from "./DeleteItem"
import { Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"



interface Items {
  _id: string
  itemid:string
  itemname: string
  description: string
  amount: 10,
  currency: string
  type: string
  consumable: string
  createdAt: string
  updatedAt: string
}



export default function page() {
  const [list, setList] = useState<Items[]>([])
  const [search, setSearch] = useState('')
   const [ totalpages, setTotalPages] = useState(0)
    const [ currentpage, setCurrentpage] = useState<number>(0)
    const [loading, setLoading] = useState(false)
    
    const router = useRouter()
 

  const fetchData = async () => {
    const res = await api.get(`/marketplace/admin/items?page=${currentpage}&limit=10&search=${search}`)
    setList(res.data.data)
    setTotalPages(res.data.pagination.totalPages)
  }


 useEffect(() => {
  setLoading(true)
    const handler = setTimeout(() => {
      fetchData();
      setLoading(false)
    }, 500);
    return () => {
      clearTimeout(handler);
    };
  }, [currentpage, search]);

  useEffect(() => {
    setCurrentpage(0)
  },[search])



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
    <div className="flex w-full h-screen overflow-x-hidden">
    
      <Sidebar/>
        <main
        className="w-full text-white h-auto overflow-y-auto "
        style={{
            backgroundImage: "url('/dashboard/assets/BG.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
        }}
        >
      <Header />

        <section className=" p-4 md:p-8">
      <h2 className="text-xl font-bold mb-4">Marketplace</h2>

      <div className=" flex items-center gap-4 flex-wrap">
      {/* <CreateTitleDialog onSave={fetchData} /> */}
      <MarketplaceItemDialog onSave={fetchData}/>
      <Input className=" w-fit text-black" value={search} onChange={(e) => setSearch(e.target.value)} placeholder='Search...'/>

      </div>

     <Table className=" mt-4">
        <TableCaption>
                          {loading && <Loader2 size={16} className="animate-spin mr-2" />}
                          
                      </TableCaption>
      
                      <TableCaption>
                         {list.length === 0 && (
                          <p className=' text-xs text-zinc-300'>No data</p>
                         )}
                          
                      </TableCaption>
                <TableHeader>
                <TableRow className=" border-b border-zinc-600">
                    <TableHead className=" text-start">Id</TableHead>
                    <TableHead className=" text-start">Name</TableHead>
                    <TableHead className=" text-start">Type</TableHead>
                    <TableHead className=" text-start">Description</TableHead>
                    <TableHead className=" text-start">Price</TableHead>
                    <TableHead className=" text-start">Consumable</TableHead>
                    <TableHead className=" text-start">Action</TableHead>
                </TableRow>
                </TableHeader>
               <TableBody>
            {list?.map((entry, index) => (
                <TableRow key={index}>
                <TableCell className=" text-left">{entry.itemid}</TableCell>
                <TableCell className=" text-left">{entry.itemname}</TableCell>
                <TableCell className=" text-left">{entry.type}</TableCell>
                <TableCell className=" text-left">{entry.description}</TableCell>
                <TableCell className=" text-left">{entry.amount} {entry.currency}</TableCell>
                <TableCell className=" text-left">{entry.consumable}</TableCell>
           

                <TableCell className="text-left">
                    <div className="flex gap-2 flex-wrap items-center">
                    <EditItemDialog initialData={entry} onSave={fetchData} />

                   

                    <DeleteItemDialog
                        name={entry.itemname}
                        id={entry.itemid}
                        onSave={fetchData}
                    />
                    </div>
                </TableCell>
                </TableRow>
            ))}
            </TableBody>

                </Table>

                 <div className=' flex items-center justify-end gap-4 mt-6'>
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
    
            
    </main> 
  </div>
 
  )
}
