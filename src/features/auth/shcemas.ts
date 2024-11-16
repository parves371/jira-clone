import { z } from "zod";
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const signUpSchema = z.object({
  name: z.string().trim().min(1, "Required"),
  email: z.string().trim().email(),
  password: z.string().min(8, "password must be at least 8 characters"),
});
