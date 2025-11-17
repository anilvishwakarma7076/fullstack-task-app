import { z } from 'zod';

export const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  mobile: z.string().min(10),
  password: z.string().min(6)
});

export const loginSchema = z.object({
  identifier: z.string().min(3),
  password: z.string().min(6)
});