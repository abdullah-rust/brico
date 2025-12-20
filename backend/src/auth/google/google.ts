// src/controllers/auth/googleCallback.ts

import { Request, Response } from "express";
import { prisma } from "../../lib/prisma"; // Aapki prisma instance
import { createAccessToken, createRefreshToken } from "../../utils/jwt";
import logger from "../../utils/logger";

// Cookie options (Assume these are imported or defined globally in your setup)
const cookieOptions = {
  httpOnly: true,
  maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
  path: "/",
  secure: process.env["NODE_ENV"] === "production",
};

const faildRedirect = process.env["GOOGLE_FIALD_URL"];
const passRedirect = process.env["GOOGLE_PASS_URL"];

// Passport ke baad ki saari logic ab is function mein hogi
export async function handleGoogleAuthCallback(req: Request, res: Response) {
  let user: any = req.user;
  let userId: string;

  if (!user) {
    // Agar Passport.authenticate ke baad req.user set na hua ho
    logger.error("1 se how");
    return res.redirect(faildRedirect || "http://localhost/google_faild");
  }

  try {
    if (user.isNewUser) {
      // New User: Database mein create karo
      const newUser = await prisma.user.create({
        data: {
          email: user.email,
          fullName: user.fullName,
          // isVerified default 'false' hoga, but Google Auth ko hum verified maan sakte hain
          // Agar aap isko 'true' set karna chahte hain, toh schema mein 'isVerified' field add karein
        },
      });
      userId = newUser.id;
    } else {
      // Existing User: Login
      userId = user.id;
    }

    // --- Token Generation and Cookie Setting ---
    const accessToken = await createAccessToken(userId);
    const refreshToken = await createRefreshToken(userId);

    if (!accessToken || !refreshToken) {
      logger.error(`Token creation failed for user ID: ${userId}`);
      return res.redirect(faildRedirect || "http://localhost/google_faild");
    }

    // Setting Cookies
    res.cookie("access_token", accessToken, cookieOptions);
    res.cookie("refresh_token", refreshToken, cookieOptions);

    // Success: Redirect to frontend dashboard
    return res.redirect(passRedirect || "http://localhost");
  } catch (error) {
    logger.error(`Google Auth Callback DB Error: ${error}`);
    // Agar DB insertion/token creation fail ho jaaye

    return res.redirect(faildRedirect || "http://localhost:3000/google_faild");
  }
}
