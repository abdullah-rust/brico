import { z } from "zod";

// Enum validation

export const userSignup = z.object({
  email: z.string().email({ message: "Valid email required" }).trim(),

  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .trim(), // optional if you don't require password on all forms

  fullName: z
    .string()
    .min(1, { message: "First name is required" })
    .max(100, { message: "First name too long" })
    .trim(),
});
