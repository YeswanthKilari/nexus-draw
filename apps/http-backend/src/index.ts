import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { middleware } from "./middleware";


const app = express();
const port: number = 3001;

app.post("/sigin", (req: Request, res: Response) => {
    const useId = 1;
    const token = jwt.sign({
        useId
    }, "iamyash")
    res.json{
        token
    }
});

app.post("/signup", (req: Request, res: Response) => {
    res.send("hello from signup"); 
})

app.post("/room",middleware, (req: Request, res: Response) => {
    res.send("Creating Room")

    res.json({
        message: "Room created successfully",
        roomid : "room123",
    })
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
