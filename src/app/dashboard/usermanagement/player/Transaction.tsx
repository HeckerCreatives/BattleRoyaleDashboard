import React, { useEffect, useState } from 'react'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell, TableCaption } from "@/components/ui/table"
import api from '@/lib/axios'
import { toast } from '@/components/ui/use-toast'
import axios from 'axios'
import { handleApiError } from '@/utils/ApiError'
import { Loader2 } from 'lucide-react'
import { TiArrowLeftThick, TiArrowRightThick } from 'react-icons/ti'


interface Transactions {
    id: string,
    type: string,
    action: string,
    itemname: string,
    amount: number,
    currency: string,
    description: string,
    date: string
}

interface Props {
    userid: string
}



export default function Transaction(props: Props) {
    const [list, setList] = useState<Transactions[]>([])
    const [qty, setQty] = useState(1)
    const [loading, setLoading] = useState(false)
    const [ totalpages, setTotalPages] = useState(0)
    const [ currentpage, setCurrentpage] = useState<number>(0)
    

     const fetchData = async () => {
        const res = await api.get(`/marketplace/admin/player/transactions?page=${currentpage}&limit=5&search=&userId=${props.userid}`)
        setList(res.data.data.transactions)
        setTotalPages(res.data.data.pagination.totalPages)
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
      }, [currentpage]);

     
  
    
  return (
     <div className=' relative w-full h-full rounded-lg flex flex-col gap-6 items-start p-4 z-50'
        style={{backgroundImage: "url('/userdashboard/Assets/TAB HOLDER small.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat:"no-repeat"}}
        >

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
                    <TableHead className=" text-start">Item</TableHead>
                    <TableHead className=" text-start">Type</TableHead>
                    <TableHead className=" text-start">Currency</TableHead>
                    <TableHead className=" text-start">Description</TableHead>
                    <TableHead className=" text-start">Amount</TableHead>
                    <TableHead className=" text-start">Date</TableHead>
                 
                </TableRow>
                </TableHeader>
               <TableBody>
            {list?.map((entry, index) => (
                <TableRow key={index}>
                <TableCell className=" text-left text-orange-400 font-semibold">{entry.itemname}</TableCell>
                <TableCell className=" text-left">{entry.type}</TableCell>
                <TableCell className=" text-left">{entry.currency}</TableCell>
                <TableCell className=" text-left text-xs">{entry.description}</TableCell>
                <TableCell className=" text-left">{entry.amount}</TableCell>
                <TableCell className=" text-left">{new Date(entry.date).toDateString()}</TableCell>
           

                
                </TableRow>
            ))}
            </TableBody>

                </Table>

            <div className=' w-full flex items-center justify-end gap-4'>
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
