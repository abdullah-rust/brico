import { Request, Response } from "express";
import logger from "../../utils/logger";
import { userSignup } from "./help";
import { prisma } from "../../lib/prisma";
import { hashPassword } from "../../utils/paswordHash";
import { generate6DigitCode } from "../../utils/genrateCode";
import { sendVerificationEmail } from "../../utils/emailSend";
import { saveVerificationCode } from "../../helpers/other";

interface SingupStruct {
  email: string;
  password: string;
  fullName: string;
}

export default async function Singup(req: Request, res: Response) {
  try {
    const formData: SingupStruct = (req as any).body;

    if (!formData) {
      return res.status(400).json({ message: "Invalid Form Data" });
    }

    const resultParsed: any = userSignup.safeParse(formData);

    if (!resultParsed.success) {
      const zodError = resultParsed.error;
      const issuesArray = zodError.issues;
      if (issuesArray && issuesArray.length > 0) {
        const firstIssue = issuesArray[0];
        const errorMessage = firstIssue.message;
        return res.status(400).json({ message: errorMessage });
      }
    }

    const data: SingupStruct = resultParsed.data;

    const checkexist = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (checkexist) {
      return res.status(400).json({ message: "User Alrady Exist" });
    }

    const hashedPassword = await hashPassword(data.password);
    if (!hashedPassword) {
      logger.error("Signup Password Hashing Faild");
      return res.status(500).json({ message: "Internal Server Error" });
    }

    const otpCode = await generate6DigitCode();
    const sendOtpEmail = await sendVerificationEmail(data.email, otpCode);

    if (!sendOtpEmail) {
      logger.error("Singup OTP Sending Error");
      return res.status(500).json({ message: "OTP Sending Error" });
    }

    data.password = hashedPassword;

    await saveVerificationCode(data, otpCode);

    return res.status(200).json({ message: "OTP Code Sent On Your Email" });
  } catch (e) {
    logger.error("Singup Error" + e);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
