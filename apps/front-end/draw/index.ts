import axios from "axios";

type Shape =
  | { type: "Rectangle"; x: number; y: number; width: number; height: number }
  | { type: "Circle"; centerX: number; centerY: number; radius: number }
  | { type: "Pencil"; points: { x: number; y: number }[] }
  | { type: "Text"; x: number; y: number; text: string };

export async function initdraw(
  canvas: HTMLCanvasElement,
  roomId: string,
  socket: WebSocket
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJkNGNlYTEwMy0xMzI3LTQ0NzYtYWM3ZC1mMzFhMzkyNzg0YTMiLCJpYXQiOjE3NTM2OTA2MjB9.Rwjv4BNuawE-IHMcyppE4BcWvRSNmsYprgYKmsXc-4o";

  const existingShapes: Shape[] = await getExistingShapes(roomId);
  let clicked = false;
  let startX = 0;
  let startY = 0;
  let pencilPoints: { x: number; y: number }[] = [];

  renderShapes(existingShapes);

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if (message.type === "chat") {
      const shape: Shape = JSON.parse(message.message).shape;
      existingShapes.push(shape);
      renderShapes(existingShapes);
    }
  };

  canvas.addEventListener("mousedown", (e) => {
    clicked = true;
    startX = e.clientX;
    startY = e.clientY;
    const tool = (window as any).selectedTool;
    if (tool === "Pencil") {
      pencilPoints = [{ x: startX, y: startY }];
    } else if (tool === "Text") {
      const text = prompt("Enter text:")?.trim();
      if (text) {
        const shape: Shape = { type: "Text", x: startX, y: startY, text };
        existingShapes.push(shape);
        renderShapes(existingShapes);
        socket.send(
          JSON.stringify({
            type: "chat",
            message: JSON.stringify({ shape }),
            roomId,
          })
        );
      }
      clicked = false;
    }
  });

  canvas.addEventListener("mouseup", (e) => {
    if (!clicked) return;
    clicked = false;

    const currentX = e.clientX;
    const currentY = e.clientY;
    const selectedTool = (window as any).selectedTool || "Circle";

    let shape: Shape;

    if (selectedTool === "Rectangle") {
      shape = {
        type: "Rectangle",
        x: startX,
        y: startY,
        width: currentX - startX,
        height: currentY - startY,
      };
    } else if (selectedTool === "Circle") {
      const radius = Math.hypot(currentX - startX, currentY - startY);
      shape = {
        type: "Circle",
        centerX: startX,
        centerY: startY,
        radius,
      };
    } else if (selectedTool === "Pencil") {
      shape = { type: "Pencil", points: pencilPoints };
    } else {
      return;
    }

    existingShapes.push(shape);
    renderShapes(existingShapes);

    socket.send(
      JSON.stringify({
        type: "chat",
        message: JSON.stringify({ shape }),
        roomId,
      })
    );
  });

  canvas.addEventListener("mousemove", (e) => {
    if (!clicked) return;

    const currentX = e.clientX;
    const currentY = e.clientY;
    const selectedTool = (window as any).selectedTool || "Circle";

    if (selectedTool === "Pencil") {
      pencilPoints.push({ x: currentX, y: currentY });
    }

    renderShapes(existingShapes);
    ctx.strokeStyle = "white";

    if (selectedTool === "Rectangle") {
      ctx.strokeRect(startX, startY, currentX - startX, currentY - startY);
    } else if (selectedTool === "Circle") {
      const radius = Math.hypot(currentX - startX, currentY - startY);
      ctx.beginPath();
      ctx.arc(startX, startY, radius, 0, Math.PI * 2);
      ctx.stroke();
    } else if (selectedTool === "Pencil") {
      ctx.beginPath();
      for (let i = 0; i < pencilPoints.length - 1; i++) {
        const p1 = pencilPoints[i];
        const p2 = pencilPoints[i + 1];
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
      }
      ctx.stroke();
    }
  });

  function renderShapes(shapes: Shape[]) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    console.log("Rendering shapes:", shapes);
    ctx.strokeStyle = "white";
    ctx.fillStyle = "white";
    for (const shape of shapes) {
      if (shape.type === "Rectangle") {
        ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
      } else if (shape.type === "Circle") {
        ctx.beginPath();
        ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.closePath();
      } else if (shape.type === "Pencil") {
        ctx.beginPath();
        for (let i = 0; i < shape.points.length - 1; i++) {
          const p1 = shape.points[i];
          const p2 = shape.points[i + 1];
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
        }
        ctx.stroke();
        ctx.closePath();
      } else if (shape.type === "Text") {
        ctx.font = "16px Arial";
        ctx.fillText(shape.text, shape.x, shape.y);
      }
    }
  }

  async function getExistingShapes(roomId: string): Promise<Shape[]> {
    try {
      const res = await axios.get(`http://localhost:3001/chats/${roomId}`, {
        headers: { Authorization: token },
      });

      const messages = Array.isArray(res.data)
        ? res.data
        : (res.data?.messages ?? []);

      return messages.map(
        (msg: { message: string }) => JSON.parse(msg.message).shape
      );
    } catch (err: any) {
      console.error(
        "Failed to fetch shapes:",
        err.response?.data || err.message
      );
      return [];
    }
  }
}
