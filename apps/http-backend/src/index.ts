import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import { middleware } from "./middleware.js";
import { JWT_SECRET } from "@repo/backend-common/config";
import { createroomschema, userschema, signinschema } from "@repo/common/types";
import { prismaClient } from "@repo/db";
import cors from "cors"

dotenv.config();
const app = express();
const port: number = 3001;
app.use(cors())
app.use(express.json());

//@ts-ignore
app.post("/signup", async (req: Request, res: Response) => {
  const parseddata = userschema.safeParse(req.body);
  if (!parseddata.success) {
    return res.status(400).json({
      message: "Invalid data",
      errors: parseddata.error.errors,
    });
  }

  try {
    const user = await prismaClient.user.create({
      data: {
        email: parseddata.data.username,
        password: parseddata.data.password,
        name: parseddata.data.name,
      },
    });
    res.json({
      message: "User signed up successfully",
      userId: user.id
      ,
    });
  } catch (e: any) {
    console.error("Error creating user:", e);
    res.status(500).json({
      message: "user already exists",
      error: e.message,
    });
  }
});

//@ts-ignore
app.post("/signin", async (req: Request, res: Response): any => {
  const data = userschema.safeParse(req.body);
  if (!data.success) {
    return res.status(400).json({
      message: "Invalid data",
      errors: data.error.errors,
    });
  }

  const user = await prismaClient.user.findFirst({
    where: {
      email: data.data.username,
      password: data.data.password,
    },
  });

  if (!user) {
    return res.status(401).json({
      message: "Invalid username or password",
    });
  }

  const token = jwt.sign(
    {
      userId: user.id, 
    },
    JWT_SECRET
  );

  res.json({
    message: "User signed check",
    token,
  });
});

//@ts-ignore
app.post("/room", middleware, async (req: Request, res: Response): any => {
  const parseddata = createroomschema.safeParse(req.body);
  if (!parseddata.success) {
    return res.status(400).json({
      message: "Invalid data",
      errors: parseddata.error.errors,
    });
  }
//@ts-ignore
  const userId = req.userId;
  try {
    const room = await prismaClient.room.create({
      data: {
        slug: parseddata.data.name,
        adminId: userId,
      }
    })
    res.json({
      message: "Room created successfully",
      roomid: room.id,
    });
  } catch (error) {
    console.error("Error creating room:", error);
    res.status(500).json({
      message: "Error creating room",
      error: (error as Error).message,
    });
  }
});


//@ts-ignore
app.get("/chats/:id",middleware, async (req: Request, res: Response): any => {
  const roomId = Number(req.params.id);
  if (isNaN(roomId)) {
    return res.status(400).json({ message: "Invalid room ID" });
  }
  try {
    const messages = await prismaClient.chat.findMany({
      where: {
        roomId: roomId,
      },
      orderBy: {
        id: "desc"
      },
      take: 50
    })
    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({
      message: "Error fetching messages",
      error: (error as Error).message,
    });
  }
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
