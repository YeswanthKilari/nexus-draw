import { initdraw } from "@/draw"
import { useEffect, useRef, useState } from "react"
import { IconButton } from "./IconButton"
import { Circle, Pencil, RectangleHorizontal, Type, ArrowRight, Move } from "lucide-react"

type Shape = "Pencil" | "Rectangle" | "Circle" | "Text" | "Arrow" | "Move";

declare global {
  interface Window {
    selectedTool: Shape;
    renderShapes?: (shapes: any[]) => void;
  }
}

export function Canvas({ roomId, socket }: { roomId: string; socket: WebSocket }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedTool, setSelectedTool] = useState<Shape>("Circle");
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    window.selectedTool = selectedTool;
  }, [selectedTool])

  useEffect(() => {
    if (!socket) return;
    if (canvasRef.current) {
      initdraw(canvasRef.current, roomId, socket, (shapes) => {
        setHistory((prev) => [...prev, JSON.stringify(shapes)]);
      });
    }
  }, [socket, canvasRef, roomId])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.ctrlKey && e.key.toLowerCase() === "z") {
        setHistory((prev) => {
          if (prev.length <= 1) return prev;
          const newHistory = prev.slice(0, -1);
          const shapes = JSON.parse(newHistory[newHistory.length - 1]);
          const canvas = canvasRef.current;
          if (canvas) {
            const ctx = canvas.getContext("2d");
            if (ctx) {
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              ctx.fillStyle = "black";
              ctx.fillRect(0, 0, canvas.width, canvas.height);
              if (typeof window.renderShapes === "function") {
                window.renderShapes(shapes);
              }
            }
          }
          return newHistory;
        });
      }
      if (e.key === "1") setSelectedTool("Pencil");
      if (e.key === "2") setSelectedTool("Rectangle");
      if (e.key === "3") setSelectedTool("Circle");
      if (e.key === "4") setSelectedTool("Text");
      if (e.key === "5") setSelectedTool("Arrow");
      if (e.key === "6") setSelectedTool("Move");
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const width = window.innerWidth;
  const height = window.innerHeight;

  function handleCanvasClick(e: React.MouseEvent<HTMLCanvasElement>) {
    if (selectedTool === "Text") {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const event = new CustomEvent("text-draw", {
        detail: {
          x,
          y,
          text: "Text"
        }
      });
      window.dispatchEvent(event);
    }
  }

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="box-border"
        onClick={handleCanvasClick}
      ></canvas>
      <Topbar setSelectedTool={setSelectedTool} selectedtool={selectedTool} />
    </div>
  )
}

function Topbar({ selectedtool, setSelectedTool }: { selectedtool: Shape; setSelectedTool: (tool: Shape) => void }) {
  return (
    <div className="fixed top-10 left-10 flex gap-2">
      <IconButton activated={selectedtool === "Pencil"} icon={<Pencil />} onClick={() => setSelectedTool("Pencil")} />
      <IconButton activated={selectedtool === "Rectangle"} icon={<RectangleHorizontal />} onClick={() => setSelectedTool("Rectangle")} />
      <IconButton activated={selectedtool === "Circle"} icon={<Circle />} onClick={() => setSelectedTool("Circle")} />
      <IconButton activated={selectedtool === "Text"} icon={<Type />} onClick={() => setSelectedTool("Text")} />
      <IconButton activated={selectedtool === "Arrow"} icon={<ArrowRight />} onClick={() => setSelectedTool("Arrow")} />
      <IconButton activated={selectedtool === "Move"} icon={<Move />} onClick={() => setSelectedTool("Move")} />
    </div>
  )
}
