import { z } from 'zod';

// Define the validation schema
export const registeruser = z.object({
  username: z.string()
    .min(6, { message: "Username must be at least 6 characters long" })
    .max(20, { message: "Username must be at most 20 characters long" })
    .regex(/^[a-zA-Z0-9]+$/, { message: "Username can only contain letters and numbers" }),

  password: z.string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(20, { message: "Password must be at most 20 characters long" })
    .regex(/^[a-zA-Z0-9@\[\] ]+$/, { message: "Password can only contain letters, numbers, @, [, ], and spaces" }),

  confirmPassword: z.string()
    .min(6, { message: "Confirm Password must be at least 6 characters long" })
    .max(20, { message: "Confirm Password must be at most 20 characters long" }),

  // country: z.string()
  //   .min(1, { message: "Country is required" }),

  email: z.string()
    .email({ message: "Invalid email address" })
})
.refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"], // This will attach the error to the confirmPassword field
});

// Infer the type from the schema
export type RegisterUser = z.infer<typeof registeruser>;