import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Target, Clock, Users, MapPin, Calendar, Sword } from "lucide-react"
import { FaGun } from "react-icons/fa6"

interface Match {
  id: string
  placement: number
  kills: number
  damage: number
  survivalTime: string
  gameMode: string
  map: string
  date: string
  teammates?: string[]
  isWin: boolean
}

const mockMatches: Match[] = [
  {
    id: "1",
    placement: 1,
    kills: 12,
    damage: 2847,
    survivalTime: "28:45",
    gameMode: "Squad",
    map: "Erangel",
    date: "2024-01-15",
    teammates: ["Player1", "Player2", "Player3"],
    isWin: true,
  },
  {
    id: "2",
    placement: 3,
    kills: 8,
    damage: 1923,
    survivalTime: "25:12",
    gameMode: "Duo",
    map: "Sanhok",
    date: "2024-01-15",
    teammates: ["Player4"],
    isWin: false,
  },
  {
    id: "3",
    placement: 15,
    kills: 4,
    damage: 1156,
    survivalTime: "12:33",
    gameMode: "Solo",
    map: "Miramar",
    date: "2024-01-14",
    isWin: false,
  },
  {
    id: "4",
    placement: 2,
    kills: 9,
    damage: 2134,
    survivalTime: "26:18",
    gameMode: "Squad",
    map: "Vikendi",
    date: "2024-01-14",
    teammates: ["Player5", "Player6", "Player7"],
    isWin: false,
  },
  {
    id: "5",
    placement: 7,
    kills: 6,
    damage: 1678,
    survivalTime: "18:42",
    gameMode: "Duo",
    map: "Erangel",
    date: "2024-01-13",
    teammates: ["Player8"],
    isWin: false,
  },
]

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

export function MatchHistory() {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 overflow-y-auto">
      <div className="text-center space-y-2">
        <h1 className="text-lg font-bold text-foreground text-white">Match History</h1>
        <p className="text-muted text-sm">Your recent battle royale performance</p>
      </div>

      <div className="space-y-4 ">
        {mockMatches.map((match) => (
           <Card key={match.id} className="bg-zinc-950 border-zinc-700 hover:bg-card/80 transition-colors">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                {/* Placement */}
                <div className="flex items-center gap-2">
                  <Badge className={`text-lg font-bold px-3 py-1 ${getPlacementColor(match.placement)}`}>
                    {getPlacementIcon(match.placement)}#{match.placement}
                  </Badge>
                  
                  {match.isWin ? <Badge className="bg-orange-600 text-black font-bold">WINNER</Badge> : <Badge className="bg-orange-600 text-black font-bold invisible">WINNER</Badge> }
                </div>

                {/* Stats */}
                <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-orange-500" />
                    <div>
                      <p className="text-sm text-muted">Kills</p>
                      <p className="font-bold text-orange-500">{match.kills}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Sword className="w-4 h-4 text-orange-500" />
                    <div>
                      <p className="text-sm text-muted">Damage</p>
                      <p className="font-bold text-white">{match.damage.toLocaleString()}</p>
                    </div>
                  </div>

            
                </div>

                {/* Map and Date */}
                <div className="flex flex-col gap-2 lg:text-right">
                  {/* <div className="flex items-center gap-2 lg:justify-end">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium text-foreground">{match.map}</span>
                  </div> */}
                  <div className="flex items-center gap-2 lg:justify-end">
                    <Calendar className="w-4 h-4 text-muted" />
                    <span className="text-sm text-muted">{match.date}</span>
                  </div>
                </div>
              </div>

              {/* Teammates */}
              {match.teammates && match.teammates.length > 0 && (
                <div className="mt-4 pt-4 border-t border-zinc-600">
                  <p className="text-sm text-muted mb-2">Teammates:</p>
                  <div className="flex flex-wrap gap-2">
                    {match.teammates.map((teammate, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {teammate}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

     
    </div>
  )
}
