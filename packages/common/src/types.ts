import { z } from 'zod';

export const userschema = z.object({
    username: z.string().min(6, "Username must be at least 6 characters long"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    name: z.string().min(3, "Name must be at least 3 characters long"),
})

export const signinschema = z.object({
  username: z.string().min(6, "Username must be at least 6 characters long"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export const createroomschema = z.object({
    name: z.string().min(3).max(20, "Room name must be between 3 and 20 characters long")
})