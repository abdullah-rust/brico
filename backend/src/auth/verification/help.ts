import { z } from "zod";

// Enum validation

export const OtpVerfication = z.object({
  email: z.string().email({ message: "Valid email required" }).trim(),

  code: z
    .string()
    .trim()
    .min(6, { message: "Code must be at least 6 characters" })
    .max(6, { message: "Code must be at least 6 characters" }), // optional if you don't require password on all forms
});
