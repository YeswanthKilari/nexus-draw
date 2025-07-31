"use client"

import { initdraw } from "@/draw"
import { useEffect, useRef, useState } from "react"
import { Canvas } from "@/components/Canvas"


export function Roomcanvas({roomId} : {roomId:string}) {
    
    const [socket, setsocket] = useState<WebSocket | null>(null);
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJkNGNlYTEwMy0xMzI3LTQ0NzYtYWM3ZC1mMzFhMzkyNzg0YTMiLCJpYXQiOjE3NTM2OTA2MjB9.Rwjv4BNuawE-IHMcyppE4BcWvRSNmsYprgYKmsXc-4o"
    const WS_URL = "ws://localhost:8080";
    useEffect(() => {
        const ws = new WebSocket(`${WS_URL}?token=${token}`);
        ws.onopen = () => {
            console.log("WebSocket connection established");
            setsocket(ws);
            ws.send(JSON.stringify({
                type: "join_room",
                roomId
            }))
        };
    },[roomId])

   

    if (!socket) {
        return <>
            <p>Connecting to WebSocket...</p>
        </>
    }
    


    return <div>
        <Canvas roomId={roomId} socket={socket}/>
    </div>
}