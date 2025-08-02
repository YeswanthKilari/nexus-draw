import { initdraw } from "@/draw"
import { useEffect, useRef, useState } from "react"
import { IconButton } from "./IconButton"
import { Circle, Pencil, RectangleHorizontal, Type } from "lucide-react"

// Shape types now include Text
type Shape = "Pencil" | "Rectangle" | "Circle" | "Text";

declare global {
  interface Window {
    selectedTool: Shape;
  }
}

export function Canvas({
  roomId, socket
}: { roomId: string; socket: WebSocket }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedTool, setSelectedTool] = useState<Shape>("Circle");
  const [textInput, setTextInput] = useState("");
  const [textPosition, setTextPosition] = useState<{ x: number, y: number } | null>(null);

  useEffect(() => {
    window.selectedTool = selectedTool;
  }, [selectedTool])

  useEffect(() => {
    if (!socket) {
      console.error("WebSocket is not initialized");
      return;
    }
    if (canvasRef.current) {
      initdraw(canvasRef.current, roomId, socket)
    }
  }, [socket, canvasRef, roomId])

  const width = window.innerWidth;
  const height = window.innerHeight;

  function handleCanvasClick(e: React.MouseEvent<HTMLCanvasElement>) {
    if (selectedTool === "Text") {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setTextPosition({ x, y });
      setTimeout(() => {
        const input = document.getElementById("text-input-box") as HTMLInputElement;
        input?.focus();
      }, 0);
    }
  }

  function handleTextSubmit() {
    if (textPosition && textInput.trim()) {
      const event = new CustomEvent("text-draw", {
        detail: {
          x: textPosition.x,
          y: textPosition.y,
          text: textInput.trim()
        }
      });
      window.dispatchEvent(event);
      setTextPosition(null);
      setTextInput("");
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

      {selectedTool === "Text" && textPosition && (
        <input
          id="text-input-box"
          className="absolute z-50 px-2 py-1 text-black bg-white border border-gray-400"
          style={{
            top: textPosition.y,
            left: textPosition.x,
            transform: "translateY(-50%)",
            position: "absolute"
          }}
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          onBlur={handleTextSubmit}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleTextSubmit();
            }
          }}
        />
      )}

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
    </div>
  )
}
