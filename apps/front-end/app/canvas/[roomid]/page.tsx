"use client"

import initdraw from "@/draw";
import { Fullscreen } from "lucide-react";
import { useEffect, useRef } from "react"

export default function canvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(()=> {
        
        if (canvasRef.current) {
            initdraw(canvasRef.current)
        }
        return
        
    }, [canvasRef])
    
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;


    return <div>
        <canvas ref={canvasRef} width={screenWidth} height={screenHeight} className="box-border"></canvas>
    </div>
}