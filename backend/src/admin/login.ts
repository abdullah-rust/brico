import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import logger from "../utils/logger";
import { verifyPassword } from "../utils/paswordHash";
import { createAdminAccessToken } from "../utils/jwt";

export default async function LoginAdmin(req: Request, res: Response) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    // 1. Admin ko find karo
    const admin = await prisma.admin.findUnique({
      where: { username },
    });

    if (!admin) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // 2. Password verify karo (Argon2)
    const isPasswordValid = await verifyPassword(admin.password, password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const accessToken = await createAdminAccessToken(admin.username);

    // 4. Success Response
    logger.info(`Admin logged in: ${admin.username}`);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken,
      admin: {
        username: admin.username,
      },
    });
  } catch (error: any) {
    logger.error("Admin Login Error: " + error.stack);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
