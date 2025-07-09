
import { WebSocketServer } from "ws";
import type { WebSocket } from "ws";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

const wss = new WebSocketServer({ port: 8080 });

interface Users {
    ws: WebSocket;
    userId: string;
    rooms: string[];
}

const users: Users[] = [];

function checkUser(token: string): string | null {
    try {
        const decoded = jwt.verify(token, JWT_SECRET, );
        if (typeof decoded == "string") {
            console.error("Decoded token is a string, expected an object");
            return null;
        }
        if (!(decoded as jwt.JwtPayload).userId) {
            console.error("Token does not contain userId");
            return null;
        }

        return decoded.userId as string;
    } catch (error) {
        console.error("Token verification failed:", error);
        return null;
    }
    return null;
}

wss.on("connection", function connection(ws,request) {
    const url = request.url;
    if (!url) {
        return;
    }
    const urlParams = new URLSearchParams(url.split("?")[1]);
    const token = urlParams.get("token");
    const userId = checkUser(token || "");
    if (!userId) {
        ws.close(1008, "Invalid token");
        return;
    }
    console.log("Decoded Token");


    users.push({
        ws: ws,
        userId,
        rooms: []
    })

    
    ws.on("message", function message(data) {
        const parsedData = JSON.parse(data.toString())
        if (parsedData.type === "join_room") {
            const user = users.find(x => x.ws === ws);
            if (!user) {
                return;
            }
            user.rooms.push(parsedData.room);
        }

        if (parsedData.type === "leave_room") {
            const user = users.find(x => x.ws === ws);
            if (!user) {
                return;
            }
            user.rooms = user.rooms.filter(room => room !== parsedData.room);
        }

        if (parsedData.type === "chat") {
            const roomId = parsedData.userId;
            const message = parsedData.message;

            users.forEach(user => {
                if (user.rooms.includes(roomId)) {
                    user.ws.send(JSON.stringify({
                        type: "chat",
                        roomId,
                        message,
                        room: parsedData.room
                    }));
                }
            } )
        }
    });
})
