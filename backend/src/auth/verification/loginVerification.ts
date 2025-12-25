import { Request, Response } from "express";
import logger from "../../utils/logger";
import { OtpVerfication } from "./help";
import {
  deleteVerificationCode,
  getVerificationCode,
} from "../../helpers/other";
import { createAccessToken, createRefreshToken } from "../../utils/jwt";

interface LoginVerificationStruct {
  email: string;
  code: string;
}

export default async function LoginVerification(req: Request, res: Response) {
  try {
    const formData: LoginVerificationStruct = (req as any).body;

    if (!formData) {
      return res.status(400).json({ message: "Invalid Form Data" });
    }

    const resultParsed: any = OtpVerfication.safeParse(formData);

    if (!resultParsed.success) {
      const zodError = resultParsed.error;
      const issuesArray = zodError.issues;
      if (issuesArray && issuesArray.length > 0) {
        const firstIssue = issuesArray[0];
        const errorMessage = firstIssue.message;
        return res.status(400).json({ message: errorMessage });
      }
    }

    const data: LoginVerificationStruct = resultParsed.data;

    const verifiyCode = await getVerificationCode(data.email);

    if (!verifiyCode) {
      return res.status(400).json({ message: "OTP Expired" });
    }

    if (verifiyCode.code !== data.code) {
      return res.status(400).json({ message: "Invalid code" });
    }

    if (!verifiyCode.id) {
      return res.status(500).json({ message: "Verification Error try again" });
    }

    await deleteVerificationCode(data.email);

    const accessToken = await createAccessToken(verifiyCode.id);
    const refreshToken = await createRefreshToken(verifiyCode.id);

    if (!accessToken || !refreshToken) {
      logger.error(`Token creation failed for user ID: ${verifiyCode.id}`);
      return res.status(500).json({ message: "Internal Server Try Again" });
    }

    // Cookie options (adjust for production)
    const cookieOptions = {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
      path: "/",
      secure: process.env["NODE_ENV"] === "production",
    };

    res.cookie("access_token", accessToken, cookieOptions);
    res.cookie("refresh_token", refreshToken, cookieOptions);

    return res
      .status(200)
      .json({
        message: "Login Successful",
        token1: accessToken,
        token2: refreshToken,
      });
  } catch (e) {
    logger.error("Login OTP Verification Error" + e);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
