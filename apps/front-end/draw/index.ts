import axios from "axios";

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

export async function initdraw(canvas: HTMLCanvasElement,roomId: string) {
    const ctx = canvas.getContext("2d");
    
    const existingshapes: Shape[] = await getexistingshapes(roomId)


  if (!ctx) {
    return;
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
      existingshapes.push({
          type: "rect",
          x: startX,
          y: startY,
          width,
          height
      })  
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
        const res = await axios.get(`${HTTP_BACKEND}/chats/${roomid}`);
        const messages = res.data.messages;
        const shapes = messages.map((x: { message: string }) => {
            const messageData = JSON.parse(x.message)
            return messageData
        })

        return shapes
    }
}