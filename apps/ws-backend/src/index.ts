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
    if (typeof decoded === "string") {
      console.error("Decoded token is a string, expected an object");
      return null;
    }
    if (!(decoded as jwt.JwtPayload).userId) {
      console.error("Token does not contain userId");
      return null;
    }

    return (decoded as jwt.JwtPayload).userId as string;
  } catch (error) {
    console.error("Token verification failed:", error);
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

  console.log("✅ Connection established for user:", userId);

  users.push({
    ws: ws,
    userId,
    rooms: [],
  });

  ws.on("message", async function message(data) {
    try {
      const parsedData = JSON.parse(data.toString());

      const user = users.find((x) => x.ws === ws);
      if (!user) return;

      switch (parsedData.type) {
        case "join_room":
          if (!parsedData.roomId) return;
          user.rooms.push(String(parsedData.roomId)); // Store as string
          console.log(`User ${user.userId} joined room ${parsedData.roomId}`);
          break;

        case "leave_room":
          if (!parsedData.roomId) return;
          user.rooms = user.rooms.filter(
            (room) => room !== String(parsedData.roomId)
          );
          console.log(`User ${user.userId} left room ${parsedData.roomId}`);
          break;

        case "chat":
          const roomIdNum = Number(parsedData.roomId); 
          const roomKey = String(parsedData.roomId); 
          const message = parsedData.message;

          if (!roomIdNum || !message) {
            ws.send(JSON.stringify({ error: "Invalid chat format" }));
            return;
          }

          // Save to DB
          await prismaClient.chat.create({
            data: {
              userId: user.userId,
              roomId: roomIdNum,
              message: message,
            },
          });
          console.log(
            `User ${user.userId} sent message in room ${roomIdNum}: ${message}`
          );
          users.forEach((u) => {
            if (u.rooms.includes(roomKey)) {
              console.log(
                `Sending message to user ${u.userId} in room ${roomKey}`)
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
    } catch (err) {
      console.error("❌ Message handling error:", err);
      ws.send(JSON.stringify({ error: "Internal server error" }));
      ws.close(1011, "Internal error");
    }
  });

  ws.on("close", (code, reason) => {
    console.log(`🔌 WebSocket disconnected: [${code}] ${reason.toString()}`);
  });
});
