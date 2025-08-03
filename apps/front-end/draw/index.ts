import axios from "axios";

// Define shape types
export type Shape =
  | { type: "Rectangle"; x: number; y: number; width: number; height: number }
  | { type: "Circle"; centerX: number; centerY: number; radius: number }
  | { type: "Pencil"; points: { x: number; y: number }[] }
  | { type: "Text"; x: number; y: number; text: string }
  | { type: "Arrow"; fromX: number; fromY: number; toX: number; toY: number };

export async function initdraw(
  canvas: HTMLCanvasElement,
  roomId: string,
  socket: WebSocket,
  onShapeChange?: (shapes: Shape[]) => void
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId") || "unknown";
  const existingShapes: Shape[] = await getExistingShapes(roomId);

  let clicked = false;
  let startX = 0;
  let startY = 0;
  let pencilPoints: { x: number; y: number }[] = [];
  let draggingShapeIndex: number | null = null;
  let dragOffset = { x: 0, y: 0 };

  renderShapes(existingShapes);
  if (typeof window !== "undefined") {
    window.renderShapes = renderShapes;
  }

  const seenMessages = new Set<string>();

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if (
      message.type === "chat" &&
      message.senderId !== userId &&
      !seenMessages.has(message.message)
    ) {
      seenMessages.add(message.message);
      const shape: Shape = JSON.parse(message.message).shape;
      existingShapes.push(shape);
      renderShapes(existingShapes);
      onShapeChange?.(existingShapes);
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
        const message = JSON.stringify({ shape });
        seenMessages.add(message);
        existingShapes.push(shape);
        renderShapes(existingShapes);
        socket.send(
          JSON.stringify({
            type: "chat",
            message,
            roomId,
            senderId: userId,
          })
        );
      }
      clicked = false;
    } else if (tool === "Move") {
      for (let i = existingShapes.length - 1; i >= 0; i--) {
        const shape = existingShapes[i];
        if (isInsideShape(shape, startX, startY)) {
          draggingShapeIndex = i;
          if (shape.type === "Rectangle") {
            dragOffset.x = startX - shape.x;
            dragOffset.y = startY - shape.y;
          } else if (shape.type === "Circle") {
            dragOffset.x = startX - shape.centerX;
            dragOffset.y = startY - shape.centerY;
          } else if (shape.type === "Text") {
            dragOffset.x = startX - shape.x;
            dragOffset.y = startY - shape.y;
          } else if (shape.type === "Arrow") {
            dragOffset.x = startX - shape.fromX;
            dragOffset.y = startY - shape.fromY;
          }
          break;
        }
      }
    }
  });

  canvas.addEventListener("mouseup", (e) => {
    if (!clicked) return;
    clicked = false;

    const currentX = e.clientX;
    const currentY = e.clientY;
    const selectedTool = (window as any).selectedTool || "Circle";

    if (selectedTool === "Move") {
      draggingShapeIndex = null;
      return;
    }

    let shape: Shape | null = null;

    if (selectedTool === "Rectangle") {
      shape = {
        type: "Rectangle",
        x: startX,
        y: startY,
        width: currentX - startX,
        height: currentY - startY,
      };
    } else if (selectedTool === "Circle") {
      shape = {
        type: "Circle",
        centerX: startX,
        centerY: startY,
        radius: Math.hypot(currentX - startX, currentY - startY),
      };
    } else if (selectedTool === "Pencil") {
      shape = { type: "Pencil", points: pencilPoints };
    } else if (selectedTool === "Arrow") {
      shape = {
        type: "Arrow",
        fromX: startX,
        fromY: startY,
        toX: currentX,
        toY: currentY,
      };
    }

    if (shape) {
      const message = JSON.stringify({ shape });
      seenMessages.add(message);
      existingShapes.push(shape);
      renderShapes(existingShapes);
      onShapeChange?.(existingShapes);
      socket.send(
        JSON.stringify({
          type: "chat",
          message,
          roomId,
          senderId: userId,
        })
      );
    }
  });

  canvas.addEventListener("mousemove", (e) => {
    if (!clicked) return;

    const currentX = e.clientX;
    const currentY = e.clientY;
    const selectedTool = (window as any).selectedTool || "Circle";

    if (selectedTool === "Pencil") {
      pencilPoints.push({ x: currentX, y: currentY });
    }

    if (selectedTool === "Move" && draggingShapeIndex !== null) {
      const shape = existingShapes[draggingShapeIndex];
      if (shape.type === "Rectangle") {
        shape.x = currentX - dragOffset.x;
        shape.y = currentY - dragOffset.y;
      } else if (shape.type === "Circle") {
        shape.centerX = currentX - dragOffset.x;
        shape.centerY = currentY - dragOffset.y;
      } else if (shape.type === "Text") {
        shape.x = currentX - dragOffset.x;
        shape.y = currentY - dragOffset.y;
      } else if (shape.type === "Arrow") {
        const dx = currentX - startX;
        const dy = currentY - startY;
        shape.fromX += dx;
        shape.fromY += dy;
        shape.toX += dx;
        shape.toY += dy;
        startX = currentX;
        startY = currentY;
      }
      renderShapes(existingShapes);
      onShapeChange?.(existingShapes);
      return;
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
      } else if (shape.type === "Arrow") {
        const { fromX, fromY, toX, toY } = shape;
        const headLength = 10;
        const angle = Math.atan2(toY - fromY, toX - fromX);

        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.lineTo(
          toX - headLength * Math.cos(angle - Math.PI / 6),
          toY - headLength * Math.sin(angle - Math.PI / 6)
        );
        ctx.moveTo(toX, toY);
        ctx.lineTo(
          toX - headLength * Math.cos(angle + Math.PI / 6),
          toY - headLength * Math.sin(angle + Math.PI / 6)
        );
        ctx.stroke();
        ctx.closePath();
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

  function isInsideShape(shape: Shape, x: number, y: number): boolean {
    if (shape.type === "Rectangle") {
      return (
        x >= shape.x &&
        x <= shape.x + shape.width &&
        y >= shape.y &&
        y <= shape.y + shape.height
      );
    } else if (shape.type === "Circle") {
      const dx = x - shape.centerX;
      const dy = y - shape.centerY;
      return dx * dx + dy * dy <= shape.radius * shape.radius;
    } else if (shape.type === "Text") {
      return (
        x >= shape.x && x <= shape.x + 100 && y >= shape.y - 16 && y <= shape.y
      );
    } else if (shape.type === "Arrow") {
      const { fromX, fromY, toX, toY } = shape;
      const dx = toX - fromX;
      const dy = toY - fromY;
      const lengthSq = dx * dx + dy * dy;

      let t = ((x - fromX) * dx + (y - fromY) * dy) / lengthSq;
      t = Math.max(0, Math.min(1, t));

      const projX = fromX + t * dx;
      const projY = fromY + t * dy;

      const dist = Math.hypot(x - projX, y - projY);
      return dist < 10;
    }
    return false;
  }
}
