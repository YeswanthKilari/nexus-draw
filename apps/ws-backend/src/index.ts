
import { WebSocketServer } from "ws";
// import { JWT_SECRET } from "@repo/backend-common/config";
import jwt from "jsonwebtoken";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", function connection(ws,request) {
    const url = request.url;
    if (!url) {
        return;
    }
    const urlParams = new URLSearchParams(url.split("?")[1]);
    const token = urlParams.get("token");
    const decoded = jwt.verify(token ?? "", "hello");
    ws.on("message", function incoming(message) {
        console.log("received: %s", message);
    });
    if (!decoded || !(decoded as jwt.JwtPayload).userId) {
      ws.close(1008, "Unauthorized");
    }
    
    ws.send("something");
})