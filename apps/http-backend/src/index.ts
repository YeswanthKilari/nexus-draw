import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { middleware } from "./middleware.js";
import { JWT_SECRET } from "@repo/backend-common/config";
import { createroomschema, userschema, signinschema } from "@repo/common/types";
import { prismaClient } from "@repo/db";

const app = express();
const port: number = 3001;
app.use(express.json());

app.post("/signin", (req: Request, res: Response): any => {
  const data = userschema.safeParse(req.body);
  if (!data.success) {
    return res.status(400).json({
      message: "Invalid data",
      errors: data.error.errors,
    });
  }
  const useId = 1;
  const token = jwt.sign(
    {
      useId,
    },
    JWT_SECRET
  );

  res.json({
    message: "User signed in successfully",
    token,
  });
});
//@ts-ignore
app.post("/signup", async (req: Request, res: Response) => {
  const data = userschema.safeParse(req.body);
  if (!data.success) {
    return res.status(400).json({
      message: "Invalid data",
      errors: data.error.errors,
    });
  }

  try {
    await prismaClient.user.create({
      data: {
        email: data.data.username,
        password: data.data.password,
        name: data.data.name,
      },
    });
    res.json({
      message: "User signed up successfully",
      userId: "user123",
    });
  } catch (e: any) {
    console.error("Error creating user:", e);
    res.status(500).json({
      message: "Internal server error",
      error: e.message,
    });
  }
});

app.post("/room", middleware, (req: Request, res: Response): any => {
  const data = createroomschema.safeParse(req.body);
  if (!data.success) {
    return res.status(400).json({
      message: "Invalid data",
      errors: data.error.errors,
    });
  }
  res.json({
    message: "Room created successfully",
    roomid: "room123",
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
