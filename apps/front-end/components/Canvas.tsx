import { initdraw } from "@/draw"
import { Socket } from "dgram"
import { useEffect, useRef } from "react"

export function Canvas({
    roomId,socket
}:{ roomId : string , socket : WebSocket}
) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
     useEffect(() => {
        
        
        if (canvasRef.current) {
            initdraw(canvasRef.current, roomId, socket)
        }
        return
        
    }, [canvasRef])
    return <div>
        <canvas ref={canvasRef} width={1920} height={1080} className="box-border"></canvas>
    </div>
}