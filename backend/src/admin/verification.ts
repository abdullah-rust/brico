import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import logger from "../utils/logger";
import { getVerificationCode, deleteVerificationCode } from "../helpers/other";
import dotenv from "dotenv";

dotenv.config();

interface VerifyStruct {
  username: string;
  otp: string;
}

export default async function VerifyAdminSignup(req: Request, res: Response) {
  try {
    const { username, otp }: VerifyStruct = req.body;

    // 1. Basic Validation
    if (!username || !otp) {
      return res.status(400).json({ message: "Username and OTP are required" });
    }

    // 2. Redis se data nikaalna (Tumhari email ke against store tha)
    const storedData = await getVerificationCode(username);

    if (!storedData) {
      return res
        .status(400)
        .json({ message: "OTP expired or not found. Please request again." });
    }

    // 3. Username aur OTP match karna
    // Humne signup request mein storedData mein username bhi save kiya tha
    if (storedData.username !== username) {
      return res.status(400).json({ message: "Invalid request data" });
    }

    if (storedData.code !== otp) {
      return res.status(401).json({ message: "Incorrect OTP code" });
    }

    // 4. Sab sahi hai, ab Admin ko Database mein create karna
    // Password pehle se hashed (argon2) Redis mein para hua hai
    const newAdmin = await prisma.admin.create({
      data: {
        username: storedData.username,
        password: storedData.password,
      },
    });

    // 5. Redis se OTP saaf kar dena (Cleaning up)
    await deleteVerificationCode(username);

    logger.info(`Admin Account Created Successfully: ${newAdmin.username}`);

    return res.status(201).json({
      success: true,
      message: "Admin account verified and created successfully!",
      admin: {
        id: newAdmin.id,
        username: newAdmin.username,
      },
    });
  } catch (error: any) {
    logger.error("Admin Verification Error: " + error.stack);

    // Agar duplicate username ka error aaye
    if (error.code === "P2002") {
      return res
        .status(409)
        .json({ message: "Username already exists in Database" });
    }

    return res.status(500).json({ message: "Internal Server Error" });
  }
}
