import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import logger from "../utils/logger";
import { saveVerificationCode } from "../helpers/other";
import { hashPassword } from "../utils/paswordHash";
import { sendVerificationEmail } from "../utils/emailSend";
import { generate6DigitCode } from "../utils/genrateCode";
import dotenv from "dotenv";

dotenv.config();

interface SignupStruct {
  username: string;
  password: string;
}

export default async function SignUpAdmin(req: Request, res: Response) {
  try {
    const ProadminEmail = process.env["PRO_ADMIN_EMAIL"];

    if (!ProadminEmail) {
      logger.error("Pro Admin Email Not Found in .env");
      return res.status(500).json({ message: "Internal Server Error" });
    }

    const { username, password }: SignupStruct = req.body;

    // 1. Basic Validation
    if (!username || !password) {
      return res.status(400).json({ message: "Invalid Form Data" });
    }

    // 2. Database check (Username exist toh nahi karta?)
    const existingAdmin = await prisma.admin.findUnique({
      where: { username },
    });

    if (existingAdmin) {
      return res.status(409).json({ message: "Username already taken" });
    }

    // 3. Hash the password (using your custom argon2 function)
    const hashedPassword = await hashPassword(password);
    if (!hashedPassword) {
      logger.error("Password Hashing Failed");
      return res.status(500).json({ message: "Internal Server Error" });
    }

    // 4. Generate 6-Digit Code
    const otpCode = await generate6DigitCode();

    const userData = {
      username,
      password: hashedPassword,
      email: username,
    };
    const isStored = await saveVerificationCode(userData, otpCode);

    if (!isStored) {
      logger.error("Failed to store OTP in Redis");
      return res.status(500).json({ message: "Redis storage error" });
    }

    // 6. Send Email to Pro Admin (Abdullah)
    const isEmailSent = await sendVerificationEmail(ProadminEmail, otpCode);

    if (!isEmailSent) {
      logger.error("Email sending failed");
      return res
        .status(502)
        .json({ message: "Could not send verification email" });
    }

    // 7. Success Response (DB mein abhi add nahi kiya, sirf request confirm ki hai)
    logger.info(`Signup request initiated for user: ${username}`);
    return res.status(200).json({
      success: true,
      message: "Verification code sent to Owner's email",
    });
  } catch (error: any) {
    logger.error("Admin Signup Error: " + error.stack);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
