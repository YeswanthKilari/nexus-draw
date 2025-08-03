"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Palette, 
  Plus, 
  Users, 
  Sparkles, 
  ArrowRight, 
  Search,
  Grid3X3,
  List,
  LogOut,
  Settings,
  Crown,
  Zap
} from "lucide-react"

interface Room {
  id: number
  slug: string
}

export default function Dashboard() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [roomName, setRoomName] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isCreating, setIsCreating] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/signin")
      return
    }

    axios
      .get("http://localhost:3001/rooms", {
        headers: { Authorization: `${token}` },
      })
      .then((res) => {
        setRooms(res.data.rooms) 
      })
      .catch((err) => {
        console.error("Failed to load rooms", err)
      })
  }, [])

  const createRoom = async () => {
    const token = localStorage.getItem("token")
    if (!token || roomName.trim().length < 3) {
      return alert("Enter a valid room name")
    }

    setIsCreating(true)
    try {
      const res = await axios.post(
        "http://localhost:3001/room",
        { name: roomName },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      )

      router.push(`/canvas/${res.data.roomid}`)
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to create room")
    } finally {
      setIsCreating(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    router.push("/signin")
  }

  const filteredRooms = rooms.filter(room => 
    room.slug.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#080808] via-[#0f0f0f] to-[#1a1a1a] text-white">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#6e59b7] rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#7d6bca] rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#6e59b7] rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse delay-500"></div>
      </div>

      <header className="relative z-10 border-b border-gray-800/50 backdrop-blur-xl bg-black/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-[#6e59b7] rounded-2xl blur-lg opacity-50"></div>
                <div className="relative bg-gradient-to-br from-[#6e59b7] to-[#7d6bca] p-3 rounded-2xl">
                  <Palette className="h-8 w-8 text-white" onClick={()=> router.push('/') }/>
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Nexus
                </h1>
                <p className="text-sm text-gray-400 flex items-center gap-1">
                  <Crown className="h-3 w-3" />
                  Creative Workspace
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white hover:bg-white/10"
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-gray-400 hover:text-red-400 hover:bg-red-500/10"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
      
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-[#6e59b7]/20 to-[#7d6bca]/10 border-[#6e59b7]/30 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#6e59b7]/20 rounded-xl">
                  <Users className="h-6 w-6 text-[#6e59b7]" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{rooms.length}</p>
                  <p className="text-sm text-gray-400">Active Rooms</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-500/20 rounded-xl">
                  <Sparkles className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">∞</p>
                  <p className="text-sm text-gray-400">Possibilities</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-orange-500/20 to-orange-600/10 border-orange-500/30 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-500/20 rounded-xl">
                  <Zap className="h-6 w-6 text-orange-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">Live</p>
                  <p className="text-sm text-gray-400">Collaboration</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8 bg-gradient-to-r from-[#6e59b7]/10 via-[#7d6bca]/5 to-[#6e59b7]/10 border-[#6e59b7]/30 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Create New Room</h2>
              <p className="text-gray-400">Start a new collaborative drawing session</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Input
                  placeholder="Enter room name (min 3 characters)"
                  className="h-14 bg-black/50 border-gray-700/50 text-white placeholder-gray-500 rounded-2xl pl-12 text-lg backdrop-blur-sm focus:border-[#6e59b7] focus:ring-[#6e59b7]/20 focus:ring-2"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                />
                <Palette className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
              </div>
              <Button
                onClick={createRoom}
                disabled={isCreating || roomName.trim().length < 3}
                className="h-14 px-8 bg-gradient-to-r from-[#6e59b7] to-[#7d6bca] hover:from-[#7d6bca] hover:to-[#8e7bd5] text-white rounded-2xl font-semibold text-lg shadow-lg shadow-[#6e59b7]/25 transition-all duration-300 hover:shadow-xl hover:shadow-[#6e59b7]/40 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Creating...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Create Room
                  </div>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
            <Input
              placeholder="Search rooms..."
              className="h-12 bg-black/30 border-gray-700/50 text-white placeholder-gray-500 rounded-xl pl-12 backdrop-blur-sm focus:border-[#6e59b7] focus:ring-[#6e59b7]/20 focus:ring-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2 bg-black/30 p-1 rounded-xl backdrop-blur-sm">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className={viewMode === 'grid' ? 'bg-[#6e59b7] hover:bg-[#7d6bca]' : 'hover:bg-white/10'}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className={viewMode === 'list' ? 'bg-[#6e59b7] hover:bg-[#7d6bca]' : 'hover:bg-white/10'}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Rooms Grid/List */}
        {filteredRooms.length > 0 ? (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
            : "space-y-4"
          }>
            {filteredRooms.map((room, index) => (
              <Card
                key={room.id}
                className="group bg-gradient-to-br from-black/40 to-gray-900/40 border-gray-700/50 backdrop-blur-sm hover:border-[#6e59b7]/50 transition-all duration-300 hover:shadow-xl hover:shadow-[#6e59b7]/20 cursor-pointer transform hover:scale-[1.02]"
                onClick={() => router.push(`/canvas/${room.id}`)}
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: 'fadeInUp 0.6s ease-out forwards'
                }}
              >
                <CardContent className={viewMode === 'grid' ? "p-6" : "p-4"}>
                  <div className={viewMode === 'grid' ? "text-center" : "flex items-center justify-between"}>
                    <div className={viewMode === 'grid' ? "mb-4" : "flex-1"}>
                      <div className={`${viewMode === 'grid' ? 'mx-auto mb-4' : 'mr-4'} w-12 h-12 bg-gradient-to-br from-[#6e59b7] to-[#7d6bca] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <Palette className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#6e59b7] transition-colors">
                        {room.slug}
                      </h3>
                      <p className="text-sm text-gray-400 mb-4">
                        Room ID: {room.id}
                      </p>
                    </div>
                    
                    <Button
                      className="bg-gradient-to-r from-[#6e59b7] to-[#7d6bca] hover:from-[#7d6bca] hover:to-[#8e7bd5] text-white rounded-xl font-semibold shadow-lg shadow-[#6e59b7]/25 transition-all duration-300 hover:shadow-xl hover:shadow-[#6e59b7]/40 group-hover:scale-105"
                      onClick={(e) => {
                        e.stopPropagation()
                        router.push(`/canvas/${room.id}`)
                      }}
                    >
                      <span className="flex items-center gap-2">
                        Join Room
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-gradient-to-br from-gray-900/40 to-black/40 border-gray-700/50 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-[#6e59b7]/20 to-[#7d6bca]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Palette className="h-12 w-12 text-[#6e59b7]" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                {searchTerm ? 'No rooms found' : 'No rooms available'}
              </h3>
              <p className="text-gray-400 mb-6 max-w-md mx-auto">
                {searchTerm 
                  ? `No rooms match "${searchTerm}". Try a different search term.`
                  : 'Create your first room to start collaborating with others!'
                }
              </p>
              {!searchTerm && (
                <Button
                  onClick={() => document.querySelector('input[placeholder*="Enter room name"]')?.focus()}
                  className="bg-gradient-to-r from-[#6e59b7] to-[#7d6bca] hover:from-[#7d6bca] hover:to-[#8e7bd5] text-white rounded-xl font-semibold shadow-lg shadow-[#6e59b7]/25 transition-all duration-300 hover:shadow-xl hover:shadow-[#6e59b7]/40"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Room
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </main>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}