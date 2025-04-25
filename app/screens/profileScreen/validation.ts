import * as z from 'zod';

// Define the schema with Zod based on the ProfileData fields
export const profileSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string()
    .regex(/^\+?[\d\s-()]{10,}$/, 'Please enter a valid phone number')
    .optional(),
  avatar: z.string().url('Please enter a valid URL').optional(),
  contacts: z.array(z.string()).optional(),
  //createdAt: z.record(z.string(), z.string()).optional(),  // For map structure
  createdAt: z.any().optional(),
  lastOnline: z.any().optional(),
  // lastOnline: z.record(z.string(), z.number()).optional(),
  pushToken: z.string().optional(),
  settings: z.object({
    notificationsEnabled: z.boolean(),
  }).optional(),
  status: z.string()
    .max(100, 'Bio must be less than 500 characters')
    .min(10, 'Bio must be at least 10 characters')
    .optional(),
  uid: z.any().optional(),
  bio: z.string()
    .max(100, 'Bio must be less than 500 characters')
    .min(10, 'Bio must be at least 10 characters')
});

// Infer the TypeScript type from the schema
export type ProfileData = z.infer<typeof profileSchema>;
export type ValidationErrors = Partial<Record<keyof ProfileData, string>>;
