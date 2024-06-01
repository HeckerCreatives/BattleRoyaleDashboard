"use client"
import React from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Sidebar from '@/components/Sidebar'


export default function page() {
  return (
    <div className=' flex w-full h-full'>
        <Sidebar/>
        <main className=' bg-zinc-900 w-full text-white'>
            <div className=' w-full h-[80px] bg-zinc-950'>

            </div>

            <div className=' flex flex-col gap-10 w-full p-8'>
                <p>Player List</p>
                <Table>
                <TableHeader className=' bg-zinc-950 hover:bg-zinc-950 text-white'>
                    <TableRow>
                    <TableHead className="w-[100px]">Invoice</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                    <TableCell className="font-medium">INV001</TableCell>
                    <TableCell>Paid</TableCell>
                    <TableCell>Credit Card</TableCell>
                    <TableCell className="text-right">$250.00</TableCell>
                    </TableRow>
                </TableBody>
                </Table>
            </div>
             
        </main>
      

    </div>
  )
}
