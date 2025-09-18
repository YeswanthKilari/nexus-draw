import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";

import { middleware } from "./middleware.js";
import { JWT_SECRET } from "@repo/backend-common/config";
import { createroomschema, userschema, signinschema } from "@repo/common/types";
import { prismaClient } from "@repo/db";
import cors from "cors"
import slowDown from "express-slow-down";

dotenv.config();
const app = express();


app.use(
  cors({
    origin: [
      "http://localhost:3000", 
      // "http://loca", 
    ],
    credentials: true,
  })
);
app.use(express.json());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
});

const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: 1,
  delayMs: () => 2000,
});

app.use(limiter);
app.use(speedLimiter);

//@ts-ignore
app.get("/health", (req, res) => res.send("OK"));
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

//@ts-ignore
app.get("/rooms", middleware, async (req: Request, res: Response) => {
  try {
    const rooms = await prismaClient.room.findMany({
      select: {
        id: true,
        slug: true,
        createdAt: true,
        adminId: true,
        // Add more fields as needed
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      message: "Rooms fetched successfully",
      rooms,
    });
  } catch (error) {
    console.error("Error fetching rooms:", error);
    res.status(500).json({
      message: "Error fetching rooms",
      error: (error as Error).message,
    });
  }
});

const port = process.env.PORT || 8080;
//@ts-ignore
app.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on port ${port}`);
});
