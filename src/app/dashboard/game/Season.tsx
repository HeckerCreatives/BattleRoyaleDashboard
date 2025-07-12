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


export interface Season {
  _id: string
  title: string
  duration: number
  status: "active" | "upcoming" | "ended"
  startedAt?: string
}

export interface Seasons {
  _id: string
  title: string
  duration: number
  status: "upcoming" | "active" | "ended"
  createdAt: string
  updatedAt: string
  __v: number
  timeInfo: any | null
}

export interface SeasonListResponse {
  message: string
  data: {
    seasons: Seasons[]
    totalSeasons: number
  }
}



export function SeasonSection() {
  const [seasons, setSeasons] = useState<SeasonListResponse>()
  const [selectedSeason, setSelectedSeason] = useState<Season | null>(null)
    const router = useRouter()
  

  const fetchSeasons = async () => {
    const res = await api.get("/season/getallseasons")
    setSeasons(res.data)
  }

  console.log(seasons)

  useEffect(() => {
    fetchSeasons()
  }, [])

const handleDelete = async (id: string) => {
  try {
    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/season/deleteseason`, 
      { seasonId: id },
      {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
      }
    )

    toast({
      variant: "default",
      title: "Season deleted",
      description: "Season has been successfully removed.",
    })

    fetchSeasons()
  } catch (error) {
    handleSeasonError(error)
  }
}

const handleStart = async (id: string) => {
  try {
    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/season/startseason`, 
      { seasonId: id },
      {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
      }
    )

    toast({
      variant: "default",
      title: "Season started",
      description: "Season is now active.",
    })

    fetchSeasons()
  } catch (error) {
    handleSeasonError(error)
  }
}

const handleEnd = async (id: string) => {
  try {
    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/season/endseason`, 
      { seasonId: id },
      {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
      }
    )

    toast({
      variant: "default",
      title: "Season ended",
      description: "Season has been successfully ended.",
    })

    fetchSeasons()
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
      <h2 className="text-xl font-bold mb-4">Seasons</h2>

      <CreateSeasonDialog onSave={fetchSeasons} />


     <Table>
                <TableHeader>
                <TableRow className=" border-b border-zinc-600">
                    <TableHead className=" text-start">Season Name</TableHead>
                    <TableHead className=" text-start">Created at</TableHead>
                    <TableHead className=" text-start">Duration (Days)</TableHead>
                    <TableHead className=" text-start">Status</TableHead>
                    <TableHead className=" text-start">Action</TableHead>
                </TableRow>
                </TableHeader>
               <TableBody>
            {seasons?.data.seasons.map((entry, index) => (
                <TableRow key={index}>
                <TableCell className=" text-left">{entry.title}</TableCell>
                <TableCell className=" text-left">{new Date(entry.createdAt).toDateString()}</TableCell>
                <TableCell className=" text-left">{entry.duration}</TableCell>
                <TableCell
                    className={`text-left font-semibold ${
                        entry.status === "upcoming"
                        ? "text-blue-500"
                        : entry.status === "active"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                    >
                    {entry.status}
                    </TableCell>

                <TableCell className="text-left">
                    <div className="flex gap-2 flex-wrap items-center">
                    <EditSeasonDialog season={entry} onSave={fetchSeasons} />

                    {entry.status === "upcoming" && (
                        <ConfirmDialog
                        title="Start Season"
                        description={`Are you sure you want to start "${entry.title}"? This action will activate the season.`}
                        confirmLabel="Start"
                        onConfirm={() => handleStart(entry._id)}
                        trigger={<Button size="sm">Start</Button>}
                        />
                    )}

                    {entry.status === "active" && (
                        <ConfirmDialog
                        title="End Season"
                        description={`Are you sure you want to end "${entry.title}"? This action cannot be undone.`}
                        confirmLabel="End"
                        danger
                        onConfirm={() => handleEnd(entry._id)}
                        trigger={<Button variant="destructive" size="sm">End</Button>}
                        />
                    )}

                    <ConfirmDialog
                        title="Delete Season"
                        description={`Are you sure you want to delete "${entry.title}"? This action is permanent.`}
                        confirmLabel="Delete"
                        danger
                        onConfirm={() => handleDelete(entry._id)}
                        trigger={<Button variant="destructive" size="sm">Delete</Button>}
                    />
                    </div>
                </TableCell>
                </TableRow>
            ))}
            </TableBody>

                </Table>

    </section>
  )
}
