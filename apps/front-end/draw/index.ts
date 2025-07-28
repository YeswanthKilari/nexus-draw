import axios from "axios";
import { json } from "stream/consumers";

type Shape = {
    type: "rect";
    x: number;
    y: number;
    width: number;
    height : number
} | {
    type: "circle",
    centerX: number;
    centerY: number;
    radius: number;
}

export async function initdraw(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
    
  const ctx = canvas.getContext("2d");
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJkNGNlYTEwMy0xMzI3LTQ0NzYtYWM3ZC1mMzFhMzkyNzg0YTMiLCJpYXQiOjE3NTM2OTA2MjB9.Rwjv4BNuawE-IHMcyppE4BcWvRSNmsYprgYKmsXc-4o";
    const HTTP_BACKEND = "http://localhost:3001/";
    const existingshapes: Shape[] = await getexistingshapes(roomId)
    
  if (!ctx) {
    return;
  }

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if (message.type == "chat") {
      const ParsedShape = JSON.parse(message.message);
      existingshapes.push(ParsedShape)
      clearcanvas(existingshapes, canvas, ctx);
    }
  }

  clearcanvas(existingshapes, canvas, ctx);
  ctx.fillStyle = "rgba(0,0,0)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  let clicked = false;
  let startX = 0;
  let startY = 0;
  canvas.addEventListener("mousedown", (e) => {
    clicked = true;
    startX = e.clientX;
    startY = e.clientY;
  });

  canvas.addEventListener("mouseup", (e) => {
      clicked = false;
      const width = e.clientX - startX;
      const height = e.clientY - startY;
      const shape: Shape = {
        type: "rect",
        x: startX,
        y: startY,
        width,
        height,
      };
    existingshapes.push(shape);
    socket.send(JSON.stringify({
      type: "chat",
      message: JSON.stringify({
        shape
      })
    }))
  });

  canvas.addEventListener("mousemove", (e) => {
    if (clicked) {
      const width = e.clientX - startX;
      const height = e.clientY - startY;
      clearcanvas(existingshapes,canvas,ctx)
      ctx.strokeStyle = "rgba(255,255,255)";

      ctx.strokeRect(startX, startY, width, height);
    }
  });

    function clearcanvas(existingshapes: Shape[], canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "rgba(0,0,0)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        existingshapes.map((shape) => {
            if (shape.type === "rect") {
                ctx.strokeStyle = "rgba(255,255,255)";
                ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
            }
        })

    };
    
    async function getexistingshapes(roomid: string) {
      const res = await axios.get(`http://localhost:3001/chats/${roomid}`, {
        headers: {
            Authorization: `${token}`
          }
      });
      
        console.log("API response:", res.data);
        const messages = res.data.messages;
        const shapes = messages.map((x: { message: string }) => {
            const messageData = JSON.parse(x.message)
            return messageData
        })

        return shapes
    }
}