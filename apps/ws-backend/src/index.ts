import { WebSocketServer } from "ws";
import type { WebSocket } from "ws";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { prismaClient } from "@repo/db";
import dotenv from "dotenv";
dotenv.config();

const wss = new WebSocketServer({ port: 8080 });

interface Users {
  ws: WebSocket;
  userId: string;
  rooms: string[];
}

const users: Users[] = [];

function checkUser(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (typeof decoded === "string") return null;
    if (!(decoded as jwt.JwtPayload).userId) return null;
    return (decoded as jwt.JwtPayload).userId as string;
  } catch {
    return null;
  }
}

wss.on("connection", function connection(ws, request) {
  const url = request.url;
  if (!url) return;

  const urlParams = new URLSearchParams(url.split("?")[1]);
  const token = urlParams.get("token");
  const userId = checkUser(token || "");
  if (!userId) {
    ws.close(1008, "Invalid token");
    return;
  }

  users.push({ ws, userId, rooms: [] });

  ws.on("message", async (data) => {
    try {
      const parsedData = JSON.parse(data.toString());
      const user = users.find((x) => x.ws === ws);
      if (!user) return;

      switch (parsedData.type) {
        case "join_room": {
          const roomId = String(parsedData.roomId);
          if (!roomId || user.rooms.includes(roomId)) return;
          user.rooms.push(roomId);
          break;
        }

        case "leave_room": {
          const roomId = String(parsedData.roomId);
          user.rooms = user.rooms.filter((room) => room !== roomId);
          break;
        }

        case "chat": {
          const roomIdNum = Number(parsedData.roomId);
          const roomKey = String(parsedData.roomId);
          const message = parsedData.message;

          if (!Number.isFinite(roomIdNum) || !message) return;

          // Check if the message already exists to prevent duplicates
          const existing = await prismaClient.chat.findFirst({
            where: {
              userId: user.userId,
              roomId: roomIdNum,
              message: message,
            },
          });

          if (!existing) {
            await prismaClient.chat.create({
              data: {
                userId: user.userId,
                roomId: roomIdNum,
                message,
              },
            });
          }

          users.forEach((u) => {
            if (
              u.ws.readyState === u.ws.OPEN &&
              u.rooms.includes(roomKey) &&
              u.ws !== ws // don't send back to sender
            ) {
              u.ws.send(
                JSON.stringify({
                  type: "chat",
                  roomId: roomIdNum,
                  message,
                })
              );
            }
          });
          break;
        }
      }
    } catch (err) {
      ws.send(JSON.stringify({ error: "Internal server error" }));
      ws.close(1011, "Internal error");
    }
  });

  ws.on("close", () => {
    const idx = users.findIndex((u) => u.ws === ws);
    if (idx !== -1) users.splice(idx, 1);
  });
});
