"use client"

import { initdraw } from "@/draw"
import { useEffect, useRef, useState } from "react"
import { Circle, Pencil, RectangleHorizontal, Type, ArrowRight, Move, Undo } from "lucide-react"

// Define all possible shape tools
type Shape = "Pencil" | "Rectangle" | "Circle" | "Text" | "Arrow" | "Move"

declare global {
  interface Window {
    selectedTool: Shape
    renderShapes?: (shapes: any[]) => void
  }
}

export function Canvas({ roomId, socket }: { roomId: string; socket: WebSocket }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedTool, setSelectedTool] = useState<Shape>("Circle")
  const [history, setHistory] = useState<string[]>([])
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [cursor, setCursor] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const resize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight })
    }
    resize()
    window.addEventListener("resize", resize)
    return () => window.removeEventListener("resize", resize)
  }, [])

  useEffect(() => {
    window.selectedTool = selectedTool
  }, [selectedTool])

  useEffect(() => {
    if (!socket) return
    if (canvasRef.current) {
      initdraw(canvasRef.current, roomId, socket, (shapes) => {
        setHistory((prev) => [...prev, JSON.stringify(shapes)])
      })
    }
  }, [socket, canvasRef, roomId])

  const handleUndo = () => {
    setHistory((prev) => {
      if (prev.length <= 1) return prev
      const newHistory = prev.slice(0, -1)
      const shapes = JSON.parse(newHistory[newHistory.length - 1])
      const canvas = canvasRef.current
      if (canvas) {
        const ctx = canvas.getContext("2d")
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          ctx.fillStyle = "black"
          ctx.fillRect(0, 0, canvas.width, canvas.height)
          if (typeof window.renderShapes === "function") {
            window.renderShapes(shapes)
          }
        }
      }
      return newHistory
    })
  }

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.ctrlKey && e.key.toLowerCase() === "z") handleUndo()
      if (e.key === "1") setSelectedTool("Pencil")
      if (e.key === "2") setSelectedTool("Rectangle")
      if (e.key === "3") setSelectedTool("Circle")
      if (e.key === "4") setSelectedTool("Text")
      if (e.key === "5") setSelectedTool("Arrow")
      if (e.key === "6") setSelectedTool("Move")
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  function handleCanvasClick(e: React.MouseEvent<HTMLCanvasElement>) {
    if (selectedTool === "Text") {
      const canvas = canvasRef.current
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const event = new CustomEvent("text-draw", {
        detail: { x, y, text: "Text" },
      })
      window.dispatchEvent(event)
    }
  }

  function handleMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return
    setCursor({ x: Math.floor(e.clientX - rect.left), y: Math.floor(e.clientY - rect.top) })
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="block w-full h-full bg-black"
        onClick={handleCanvasClick}
        onMouseMove={handleMouseMove}
      ></canvas>

      <Topbar
        selectedtool={selectedTool}
        setSelectedTool={setSelectedTool}
        handleUndo={handleUndo}
      />

      <div className="fixed bottom-4 left-4 text-gray-400 bg-black/40 px-4 py-2 text-sm rounded-lg shadow">
        Tool: {selectedTool} | X: {cursor.x} Y: {cursor.y}
      </div>
    </div>
  )
}

function Topbar({ selectedtool, setSelectedTool, handleUndo }: { selectedtool: Shape; setSelectedTool: (tool: Shape) => void; handleUndo: () => void }) {
  const tools: { tool: Shape; icon: React.ReactNode; label: string }[] = [
    { tool: "Pencil", icon: <Pencil />, label: "Pencil (1)" },
    { tool: "Rectangle", icon: <RectangleHorizontal />, label: "Rectangle (2)" },
    { tool: "Circle", icon: <Circle />, label: "Circle (3)" },
    { tool: "Text", icon: <Type />, label: "Text (4)" },
    { tool: "Arrow", icon: <ArrowRight />, label: "Arrow (5)" },
    { tool: "Move", icon: <Move />, label: "Move (6)" },
  ]

  return (
    <div className="fixed top-5 left-5 z-50 flex gap-2 bg-black/30 p-2 rounded-xl backdrop-blur-md shadow-md">
      {tools.map(({ tool, icon, label }) => (
        <button
          key={tool}
          title={label}
          onClick={() => setSelectedTool(tool)}
          className={`rounded-lg p-2 transition-colors duration-200 flex items-center justify-center text-white hover:bg-white/10 ${selectedtool === tool ? "bg-[#6e59b7]" : ""}`}
        >
          {icon}
        </button>
      ))}
      <button
        title="Undo (Ctrl+Z)"
        onClick={handleUndo}
        className="rounded-lg p-2 ml-2 bg-red-500/20 text-white hover:bg-red-500/40 transition"
      >
        <Undo className="h-4 w-4" />
      </button>
    </div>
  )
}
