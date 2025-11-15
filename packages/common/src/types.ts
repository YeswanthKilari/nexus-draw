import { z } from 'zod';
import { email } from 'zod/v4';

export const userschema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    email: z.string().email("Invalid email address"),
})

export const signinschema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export const createroomschema = z.object({
    name: z.string().min(3).max(20, "Room name must be between 3 and 20 characters long")
})