"use client"

import { initdraw } from "@/draw"
import { useEffect, useRef } from "react"

export function Canvas({roomId} : {roomId:string}) {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(()=> {
        
        if (canvasRef.current) {
            initdraw(canvasRef.current, roomId)
        }
        return
        
    }, [canvasRef])
    


    return <div>
        <canvas ref={canvasRef} width={1920} height={1080} className="box-border"></canvas>
    </div>
}