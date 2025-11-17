import { z } from 'zod';

export const approveFacultySchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid faculty ID'),
  }),
  body: z.object({
    approvalStatus: z.enum(['APPROVED', 'REJECTED'] as const, {
      message: 'Status must be APPROVED or REJECTED',
    }),
  }),
});

export const listUsersSchema = z.object({
  query: z.object({
    role: z.enum(['FACULTY', 'STUDENT']).optional(),
    page: z.string().transform(Number).pipe(z.number().min(1)).optional().default(1),
    limit: z.string().transform(Number).pipe(z.number().min(1).max(100)).optional().default(10),
  }),
});

export const updateUserSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid user ID'),
  }),
  body: z.object({
    name: z.string().min(2).max(100).optional(),
    email: z.string().email().optional(),
    mobile: z.string().regex(/^\d{10}$/).optional(),
    dob: z
      .string()
      .refine((date) => !isNaN(Date.parse(date)), {
        message: 'Invalid date format',
      })
      .optional(),
    department: z.string().min(2).optional(),
  }),
});

export const deleteUserSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid user ID'),
  }),
});

export type ApproveFacultyInput = z.infer<typeof approveFacultySchema>['body'];
export type ListUsersQuery = z.infer<typeof listUsersSchema>['query'];
export type UpdateUserInput = z.infer<typeof updateUserSchema>['body'];