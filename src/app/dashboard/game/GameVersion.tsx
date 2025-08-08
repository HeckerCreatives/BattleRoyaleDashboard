'use client'

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SquarePen, X } from "lucide-react"
import axios from "axios"
import { toast } from "@/components/ui/use-toast"

export default function GameVersionCard() {
  const [id, setId] = useState<string>("")
  const [version, setVersion] = useState("")
  const [tempVersion, setTempVersion] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)

  // Fetch current version
  useEffect(() => {
    const fetchVersion = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/version/getactiveversion`,
            {
           withCredentials: true,
             headers: { 'Content-Type': 'application/json' }
            }
        )
        const data = res.data.data
        setId(data.id)
        setVersion(data.version)
        setTempVersion(data.version)

        console.log(data)
      } catch (err) {
        console.error("Failed to fetch version:", err)
      }
    }
    fetchVersion()
  }, [])

  const handleSave = async () => {
    console.log(id, tempVersion)
    try {
      setLoading(true)
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/version/editversion`, {
        id: id,
        version: tempVersion,
      },
     {
           withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
            })
      setVersion(tempVersion)
      setIsEditing(false)
    //   toast("Version updated")
     toast({
            variant: "default",
            title: "Success",
            description: `Version updated successfully`,
          })
          window.location.reload()
    } catch (err) {
      console.error("Failed to update version:", err)
    //   toast.error("Failed to update version")
      toast({
            variant: "destructive",
            title: "Error",
            description: `Failed to update version`,
          })
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setTempVersion(version)
    setIsEditing(false)
  }

  return (
    <div className="w-full flex items-start justify-start">
      <Card className="w-full max-w-sm bg-zinc-800 border-zinc-600 text-white">
        <CardContent className="h-full flex items-center p-6 gap-6">
          <img src="/logo 06 B.png" alt="ROF" width={100} height={100} />
          <div className="flex flex-col gap-2">
            <p className="text-sm text-muted">Game Version</p>

            <div className="flex items-center gap-2"><p className=" text-sm">V.</p>
              {isEditing ? (
                <>
                  <Input
                    value={tempVersion}
                    onChange={(e) => setTempVersion(e.target.value)}
                    className="text-sm text-black"
                  />
                  <Button
                    size="sm"
                    variant="default"
                    onClick={handleSave}
                    className="text-xs"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save"}
                  </Button>
                  <button className="text-red-600" onClick={handleCancel}>
                    <X size={20} />
                  </button>
                </>
              ) : (
                <>
                  <span className="text-sm font-medium">{version}</span>
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="text-xs p-2 h-fit"
                  >
                    <SquarePen size={15} />
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
