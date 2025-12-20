import { Request, Response } from "express";
import logger from "../../utils/logger";
import { userLogin } from "./help";
import { prisma } from "../../lib/prisma";
import { generate6DigitCode } from "../../utils/genrateCode";
import { sendVerificationEmail } from "../../utils/emailSend";
import { saveVerificationCode } from "../../helpers/other";
import { verifyPassword } from "../../utils/paswordHash";

interface LoginStruct {
  id?: string;
  email: string;
  password: string;
}

export default async function Login(req: Request, res: Response) {
  try {
    const formData: LoginStruct = (req as any).body;

    if (!formData) {
      return res.status(400).json({ message: "Invalid Form Data" });
    }

    const resultParsed: any = userLogin.safeParse(formData);

    if (!resultParsed.success) {
      const zodError = resultParsed.error;
      const issuesArray = zodError.issues;
      if (issuesArray && issuesArray.length > 0) {
        const firstIssue = issuesArray[0];
        const errorMessage = firstIssue.message;
        return res.status(400).json({ message: errorMessage });
      }
    }

    const data: LoginStruct = resultParsed.data;

    const checkexist = await prisma.user.findUnique({
      where: { email: data.email },
      select: { id: true, password: true },
    });

    if (!checkexist) {
      return res.status(400).json({ message: "Invalid Email or Password" });
    }

    if (!checkexist.password) {
      return res.status(400).json({ message: "Invalid Email or Password" });
    }
    if (!checkexist.id) {
      return res.status(500).json({ message: "id fetch error" });
    }

    const unhashedPassword = await verifyPassword(
      checkexist.password,
      data.password
    );

    if (!unhashedPassword) {
      return res.status(400).json({ message: "Invalid Email or Password" });
    }

    const otpCode = await generate6DigitCode();
    const sendOtpEmail = await sendVerificationEmail(data.email, otpCode);

    if (!sendOtpEmail) {
      logger.error("Login OTP Sending Error");
      return res.status(500).json({ message: "OTP Sending Error" });
    }

    data.id = checkexist.id;
    await saveVerificationCode(data, otpCode);

    return res.status(200).json({ message: "OTP Code Sent On Your Email" });
  } catch (e) {
    logger.error("LogIn Error" + e);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
