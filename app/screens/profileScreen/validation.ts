// app/profile/types/schema.ts
import * as z from 'zod';

export const profileSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  status: z.enum(['Available', 'Busy', 'Away']),
  location: z.string()
    .min(2, 'Location must be at least 2 characters')
    .max(100, 'Location must be less than 100 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string()
    .regex(/^\+?[\d\s-()]{10,}$/, 'Please enter a valid phone number'),
  website: z.string()
    .url('Please enter a valid URL')
    .or(z.string().length(0))
    .optional(),
  bio: z.string()
    .max(500, 'Bio must be less than 500 characters')
    .min(10, 'Bio must be at least 10 characters'),
});

export type ProfileData = z.infer<typeof profileSchema>;
export type ValidationErrors = Partial<Record<keyof ProfileData, string>>;