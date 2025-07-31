import { initdraw } from "@/draw"
import { Socket } from "dgram"
import { useEffect, useRef,useState } from "react"
import { IconButton } from "./IconButton"
import { Circle, Pencil, RectangleHorizontal } from "lucide-react"

enum Tool {
    Pencil = "Pencil",
    Rectangle = "Rectangle",
    Circle = "Circle"
}

export function Canvas({
    roomId,socket
}:{ roomId : string , socket : WebSocket}
) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [selectedTool, setSelectedTool] = useState<Tool>(Tool.Circle);

    useEffect(() => {
        if (!socket) {
            console.error("WebSocket is not initialized");
            return;
        }
        if (canvasRef.current) {
            initdraw(canvasRef.current, roomId, socket)
        }
        return
        
    }, [socket,canvasRef, roomId])

    const width = window.innerWidth;
    const height = window.innerHeight;
    return <div>
        <canvas ref={canvasRef} width={width} height={height} className="box-border"></canvas>
        <Topbar setSelectedTool={setSelectedTool} selectedtool={selectedTool} />
    </div>
}

function Topbar({ selectedtool, setSelectedTool }: { selectedtool: Tool, setSelectedTool: (tool: Tool) => void }) {
    return <div className="fixed top-10 left-10 flex gap-2">
        <IconButton activated={selectedtool === Tool.Pencil} icon={<Pencil />} onClick={() => {
            setSelectedTool(Tool.Pencil);
        }} ></IconButton>
        <IconButton activated={selectedtool === Tool.Rectangle} icon={<RectangleHorizontal />} onClick={() => {
            setSelectedTool(Tool.Rectangle);
        }} ></IconButton>
        <IconButton activated={selectedtool === Tool.Circle} icon={<Circle />} onClick={() => {
            setSelectedTool(Tool.Circle);
        }} ></IconButton>
    </div>
}