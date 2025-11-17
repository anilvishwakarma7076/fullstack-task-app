import { z } from 'zod';

export const createStudentSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  mobile: z.string().min(10),
  dob: z.string().optional(),
  department: z.string().optional()
});

export const updateStudentSchema = z.object({
  name: z.string().min(2).optional(),
  department: z.string().optional()
});