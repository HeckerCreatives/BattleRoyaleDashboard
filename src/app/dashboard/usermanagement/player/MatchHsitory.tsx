import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Target, Clock, Users, MapPin, Calendar, Sword } from "lucide-react"
import { FaGun } from "react-icons/fa6"
import { useEffect, useState } from "react"
import axios, { AxiosError } from "axios"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { TiArrowLeftThick, TiArrowRightThick } from 'react-icons/ti'
import { Loader2 } from 'lucide-react'



interface History {
  id: string,
  player: string,
  kills: number,
  placement: number,
  createdAt: string
}

interface Props {
    userid: string
}

function getPlacementColor(placement: number): string {
  if (placement === 1) return "bg-orange-600 text-black"
  if (placement <= 3) return "bg-orange-500 text-black"
  if (placement <= 10) return "bg-orange-400 text-white"
  return "bg-red-500 text-white"
}

function getPlacementIcon(placement: number) {
  if (placement === 1) return <Trophy className="w-4 h-4" />
  return null
}

export function MatchHistory(props: Props){
  const { toast } = useToast()
  const router = useRouter()
  const [history, setHistory] = useState<History[]>([])
  const [loading, setLoading] = useState(false)
  const [ totalpages, setTotalPages] = useState(0)
  const [ currentpage, setCurrentpage] = useState<number>(0)

  useEffect(() => {
      setLoading(true)
          const playerData = async () => {
              try {
                  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/matchhistory/admin/viewmatchhistory?page=${currentpage}&limit=5&playerid=${props.userid}`,{
                      withCredentials: true,
                      headers: {
                      'Content-Type': 'application/json',
                  }
                  })

                  setHistory(response.data.data)
                  setTotalPages(response.data.pagination.totalPages)
                  setLoading(false)
               
              } catch (error) {
                  setLoading(false)

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
          playerData()
  
},[currentpage])


  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 py-6">
      <div className="text-center space-y-2">
        <h1 className="text-lg font-bold text-foreground text-white">Match History</h1>
        <p className="text-muted text-sm">Your recent battle royale performance</p>
      </div>

      <div className="space-y-2 max-h-[500px] overflow-y-auto">
        {history.map((match) => (
           <Card key={match.id} className="bg-zinc-950 border-zinc-700 hover:bg-zinc-900 transition-colors">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                   {/* Placement */}
                  <div className="flex items-center gap-2">
                    <Badge className={`text-lg font-bold px-3 py-1 ${getPlacementColor(match.placement)}`}>
                      {/* {getPlacementIcon(match.placement)} */}
                      #{match.placement}
                    </Badge>
                    
                  </div>

                  {/* Stats */}
                  <div className="flex flex-wrap items-start gap-4">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-orange-500" />
                      <div>
                        <p className="text-sm text-muted">Kills</p>
                        <p className="font-bold text-orange-500">{match.kills}</p>
                      </div>
                    </div>

                    {match.placement === 1 ? <Badge className="bg-green-400 text-black font-bold w-fit text-xs py-1">WINNER</Badge> : <Badge className="bg-orange-600 text-black font-bold invisible">WINNER</Badge> }


              
                  </div>
                </div>
               

                <div className="flex flex-col gap-2 lg:text-right">
                 
                  <div className="flex items-center gap-2 lg:justify-end">
                    <Calendar className="w-4 h-4 text-muted" />
                    <span className="text-sm text-muted">{new Date(match.createdAt).toDateString()}</span>
                    <span className="text-sm text-muted">{new Date(match.createdAt).toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>

             
            </CardContent>
          </Card>
        ))}

        {history.length === 0 && (
          <div className=" w-full h-full flex items-center justify-center py-16">
            <p className=" text-xs text-zinc-400">No match history.</p>
          </div>
        )}

        {loading && (
          <div className=" w-full flex items-center justify-center">
            <Loader2 size={20} className="animate-spin text-white" />
          </div>
        )}
        
      </div>

        {history.length !== 0 && (
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
      )}

     
    </div>
  )
}
