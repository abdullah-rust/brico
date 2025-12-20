// mailer.ts
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Brico Color Scheme
const ACCENT_COLOR = "#FF9900"; // Primary Accent (Safety Orange)
const MAIN_COLOR = "#3A4750"; // Secondary/Main (Dark Slate Gray)
const BACKGROUND_COLOR = "#F0F0F0"; // Light Gray/Off-White

// Transporter create karein
const transporter = nodemailer.createTransport({
  service: "gmail", // agar Gmail use kar rahe ho
  auth: {
    user: process.env["EMAIL_USER"], // tumhari email
    pass: process.env["EMAIL_PASS"], // app password (App Password use karein)
  },
});

/**
 * Brico verification email bhejta hai.
 * @param email - Receiver ki email address.
 * @param code - 6-digit verification code.
 * @returns Email send hua toh true, warna false.
 */
export async function sendVerificationEmail(
  email: string,
  code: string
): Promise<boolean> {
  try {
    await transporter.sendMail({
      // Hum 'Brico' ke naam se bhejenge
      from: `"Brico Support" <${process.env["EMAIL_USER"]}>`,
      to: email,
      subject: "Brico Account Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 0; background: ${BACKGROUND_COLOR};">
            
            <div style="background-color: ${ACCENT_COLOR}; color: #ffffff; padding: 15px 20px; text-align: center; border-top-left-radius: 8px; border-top-right-radius: 8px;">
                <h1 style="margin: 0; font-size: 24px; font-weight: bold;">Brico</h1>
            </div>

            <div style="padding: 30px; background: #ffffff; border: 1px solid #e5e7eb; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
                <h2 style="color: ${MAIN_COLOR}; text-align: center; margin-top: 0;">🔐 Email Verification</h2>
                
                <p style="font-size: 16px; color: ${MAIN_COLOR};">
                    Assalamualaikum 👋, 
                </p>
                <p style="font-size: 16px; color: #374151;">
                  Thank you for registering with Braco. Here is your **6-digit verification code**. This code is valid for 5 minutes only:</p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <span style="font-size: 32px; letter-spacing: 8px; font-weight: bold; color: #ffffff; background: ${ACCENT_COLOR}; padding: 15px 25px; border-radius: 10px; display: inline-block;">
                        ${code}
                    </span>
                </div>
                
                <p style="font-size: 14px; color: #6b7280; border-top: 1px solid #f0f0f0; padding-top: 15px;">
                    If you did not request this, please ignore this email.
                </p>
            </div>

            <div style="padding: 10px; text-align: center;">
                <p style="font-size: 12px; color: #6b7280; margin: 0;">
                    Brico - Build your dreams, connect with skilled hands.
                </p>
            </div>
        </div>
      `,
    });

    return true;
  } catch (e) {
    console.error("Email send error:", e);
    return false;
  }
}
