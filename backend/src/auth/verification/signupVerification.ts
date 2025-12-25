import { Request, Response } from "express";
import logger from "../../utils/logger";
import { OtpVerfication } from "./help";
import {
  deleteVerificationCode,
  getVerificationCode,
} from "../../helpers/other";
import { createAccessToken, createRefreshToken } from "../../utils/jwt";
import { prisma } from "../../lib/prisma";

interface SignupVerificationStruct {
  email: string;
  code: string;
}

interface SingupStruct {
  email: string;
  password: string;
  fullName: string;
  code: string;
}

export default async function SignupVerification(req: Request, res: Response) {
  try {
    const formData: SignupVerificationStruct = (req as any).body;

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

    const data: SignupVerificationStruct = resultParsed.data;

    const verifiyCode: SingupStruct = await getVerificationCode(data.email);

    if (!verifiyCode) {
      return res.status(400).json({ message: "OTP Expired" });
    }

    if (verifiyCode.code !== data.code) {
      return res.status(400).json({ message: "Invalid code" });
    }
    await deleteVerificationCode(verifiyCode.email);
    const createUser = await prisma.user.create({
      data: {
        email: verifiyCode.email,
        fullName: verifiyCode.fullName,
        password: verifiyCode.password,
      },
    });

    const accessToken = await createAccessToken(createUser.id);
    const refreshToken = await createRefreshToken(createUser.id);

    if (!accessToken || !refreshToken) {
      logger.error(`Token creation failed for user ID: ${createUser.id}`);
      return res
        .status(500)
        .json({ message: "Internal Server Error Try Again" });
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

    return res.status(200).json({
      message: "SignUp Successful",
      token1: accessToken,
      token2: refreshToken,
    });
  } catch (e) {
    logger.error("Signup OTP Verification Error" + e);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
