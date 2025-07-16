"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import Sidebar from "@/components/Sidebar"
import Header from "@/components/Header"
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs"
import axios, { AxiosError } from "axios"
import { Loader2, RefreshCcw } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { SeasonSection } from "./Season"
import GameVersionCard from "./GameVersion"

export interface LeaderboardHistoryOptionsResponse {
  message: string
  data: {
    options: {
      name: string
      index: number
    }[]
    totalOptions: number
  }
}

export interface LeaderboardEntry {
  user: string
  amount: number
}

export interface LeaderboardResponse {
  message: string
  data: {
    leaderboard: {
      [key: string]: LeaderboardEntry
    }
  }
}




export default function page() {
 
  const [seasonName, setSeasonName] = useState("")
  const router = useRouter()
  const [loading, setLoading] = useState(false)


    const [seasons, setSeasons] = useState<LeaderboardHistoryOptionsResponse>()
    const [selectedSeason, setSelectedSeason] = useState("")
    const [leaderboards, setLeaderboards] = useState<LeaderboardResponse>()

    // Fetch seasons
    useEffect(() => {
    const fetchSeasons = async () => {
        try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/leaderboard/getleaderboardhistoryoptions`,{
            withCredentials: true,
          headers: { 'Content-Type': 'application/json' },
        })
        setSeasons(res.data || [])
        setSelectedSeason(res.data?.[0] || "")
        } catch (err) {
        console.error("Failed to fetch seasons", err)
        }
    }
    fetchSeasons()
    }, [])

    useEffect(() => {
    const fetchLeaderboard = async () => {
        if (!selectedSeason) return
        try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/leaderboard/getleaderboardsa?index=${Number(selectedSeason)}`, {
            withCredentials: true,
          headers: { 'Content-Type': 'application/json' },
        })
        setLeaderboards(res.data || [])
        } catch (err) {
        console.error("Failed to fetch leaderboard", err)
        }
    }
    fetchLeaderboard()
    }, [selectedSeason])

    useEffect(() => {
        setSelectedSeason(String(seasons?.data.options[0]?.index))
    },[seasons])


    const handleResetLeaderboard = async () => {
        setLoading(true)
        try {
          await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/leaderboard/resetleaderboard`, {
        
          }, {
            withCredentials: true,
            headers: { 'Content-Type': 'application/json' },
          });
    
       
    
          toast({
            variant: "default",
            title: "Success",
            description: `Leaderboard have been reset.`,
          });

          setLoading(false)
        } catch (error) {
          setLoading(false)

          if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError<{ message: string, data: string }>;
            if (axiosError.response && axiosError.response.status === 401) {
              router.push('/');
              toast({
                variant: 'destructive',
                title: `${axiosError.response.data.message}`,
                description: `${axiosError.response.data.data}`,
              });
            }
          }
        }
      };


    const handleReset = async () => {
    try {
      setLoading(true)

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/energy/resetenergy`,
        {},
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      )

      toast({
        variant: "default",
        title: "Success",
        description: "Energy has been reset for all players.",
      })
    } catch (error) {
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
          title: message || "Reset failed",
          description: description || "An error occurred while resetting energy.",
        })
      }
    } finally {
      setLoading(false)
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

        <Tabs defaultValue="version" className="w-full  p-8">
            <div className="overflow-x-auto">
              <TabsList className="mb-6 text-xs bg-zinc-800 flex w-max whitespace-nowrap px-2">
                <TabsTrigger value="version" className="text-xs">Game Version</TabsTrigger>
                <TabsTrigger value="leaderboards" className="text-xs">Leaderboards</TabsTrigger>
                <TabsTrigger value="seasons" className="text-xs">Seasons</TabsTrigger>
                <TabsTrigger value="reset" className="text-xs">Energy</TabsTrigger>
              </TabsList>
            </div>

            {/* <TabsList className="mb-6 text-xs bg-zinc-800">
            <TabsTrigger value="version" className=" text-xs">Game Version</TabsTrigger>
            <TabsTrigger value="leaderboards" className=" text-xs">Leaderboards</TabsTrigger>
            <TabsTrigger value="seasons" className=" text-xs">Seasons</TabsTrigger>
            <TabsTrigger value="reset" className=" text-xs">Energy</TabsTrigger>
            </TabsList> */}
            <TabsContent value="version" className=" flex items-start justify-start">
              <GameVersionCard/>
            </TabsContent>

            <TabsContent value="leaderboards">
            <section>
                <h2 className="text-xl font-bold mb-4">Leaderboards</h2>
                <div className="flex items-center gap-4 mb-4">
                <Select value={selectedSeason} onValueChange={setSelectedSeason}>
                    <SelectTrigger className=" w-fit bg-zinc-700 text-xs">
                    <SelectValue placeholder="Select Season" />
                    </SelectTrigger>
                    <SelectContent>
                    {seasons?.data.options.map((season) => (
                        <SelectItem key={season.index} value={`${season.index}`}>
                        {season.name}
                        </SelectItem>
                    ))}
                    </SelectContent>
                </Select>

                <Button disabled={loading} onClick={handleResetLeaderboard} className="bg-orange-600 gap-1 disabled:bg-orange-500">
                    {loading ? (
                        <Loader2 size={15} className="animate-spin" />
                    ) : (
                        <RefreshCcw size={15} />
                    )}
                    Reset
                </Button>

                </div>

                <div className=" rounded-md overflow-hidden">
                    {/* Table Header */}
                   

                    {/* Scrollable Table Body */}
                    <div className="max-h-[600px] overflow-y-auto">
                        <Table>
                        <TableHeader>
                        <TableRow className=" border-b border-zinc-600">
                            <TableHead className=" text-start">Rank</TableHead>
                            <TableHead className=" text-start">Player</TableHead>
                            <TableHead className=" text-start">Points</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                            {Object.values(leaderboards?.data.leaderboard || {}).map((entry, index) => (
                            <TableRow key={index} className=" border-b border-zinc-700">
                                <TableCell className=" text-left">{index + 1}</TableCell>
                                <TableCell className=" text-left">{entry.user}</TableCell>
                                <TableCell className=" text-left">{entry.amount}</TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                        </Table>
                    </div>
                    </div>


            </section>
            </TabsContent>

            <TabsContent value="seasons">
            <section>
              
                <SeasonSection/>
            </section>
            </TabsContent>

            <TabsContent value="reset">
            <section>
                <h2 className="text-xl font-bold mb-4">Reset</h2>
                <Card className="max-w-md bg-zinc-800 border-zinc-600">
                <CardHeader>
                    <CardTitle className="text-white text-lg">Reset Energy</CardTitle>
                    <CardDescription className="text-sm">
                    This will reset the energy for all players manually. Use with caution.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-white">
                    <Button
                    variant="default"
                    className="gap-1"
                    onClick={handleReset}
                    disabled={loading}
                    >
                    <RefreshCcw size={15} className={loading ? "animate-spin" : ""} />
                    {loading ? "Resetting..." : "Reset"}
                    </Button>
                </CardContent>
                </Card>
            </section>
            </TabsContent>
        </Tabs>
        </main>

    
    </div>
  )
}
