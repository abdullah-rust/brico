import { z } from "zod";

// Enum validation

export const userLogin = z.object({
  email: z.string().email({ message: "Valid email required" }).trim(),

  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .trim(), // optional if you don't require password on all forms
});
