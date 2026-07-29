import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: 'Name is required',
        invalid_type_error: 'Name must be a string',
      })
      .min(2, 'Name must be at least 2 characters long')
      .max(50, 'Name must not exceed 50 characters')
      .trim(),
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email('Please provide a valid email address'),
    password: z
      .string({
        required_error: 'Password is required',
      })
      .min(6, 'Password must be at least 6 characters long'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email('Please provide a valid email address'),
    password: z
      .string({
        required_error: 'Password is required',
      })
      .min(1, 'Password is required'), // Just ensure it's provided for login
  }),
});
