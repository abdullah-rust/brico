import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import logger from "../utils/logger";
import { uploadFile, deleteFile } from "../helpers/s3Helpers";

interface EditProfileData {
  fullName: string;
  phoneNumber: string;
  address: string;
  bio: string;
  skills: string[] | string; // FormData se string bhi aa sakti hai
  experienceYears: number;
  role: string;
}

export default async function UpdateProfile(req: Request, res: Response) {
  let profilePictureKey: string | undefined;

  try {
    const userId = (req as any).userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const {
      fullName,
      phoneNumber,
      address,
      bio,
      skills,
      experienceYears,
      role,
    }: EditProfileData = req.body;

    // 1. Agar nayi file aayi hai toh pehle upload karo
    if (req.file) {
      profilePictureKey = await uploadFile(req.file);
      logger.info(
        `New profile picture uploaded for user ${userId}: ${profilePictureKey}`
      );
    }

    // 2. Validation
    if (!fullName) {
      // Agar validation fail ho jaye toh nayi upload ki hui image foran delete karo
      if (profilePictureKey) await deleteFile(profilePictureKey);
      return res.status(400).json({ message: "Full Name is required" });
    }

    // Skills handling (Frontend FormData aksar array ko string bana deta hai)
    const formattedSkills =
      typeof skills === "string" ? JSON.parse(skills) : skills;

    // 3. Database Update (User + Worker)
    // Hum "Transaction" use karein ge taake ya toh dono update hon ya aik bhi nahi
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: {
          fullName,
          phoneNumber,
          address,
          role,
          ...(profilePictureKey && { profilePicture: profilePictureKey }),
        },
      }),
      prisma.worker.upsert({
        where: { userId },
        create: {
          userId,
          bio,
          skills: formattedSkills,
          experienceYears: parseInt(experienceYears as any) || 0,
          profession: role || "UNKNOWN",
        },
        update: {
          bio,
          skills: formattedSkills,
          experienceYears: parseInt(experienceYears as any) || 0,
        },
      }),
    ]);

    return res.status(200).json({ message: "Profile updated successfully" });
  } catch (e: any) {
    // 🔥 ROLLBACK: Agar DB update phat gaya toh S3 se nayi picture urha do
    if (profilePictureKey) {
      logger.warn(
        `Profile DB update failed. Deleting uploaded image: ${profilePictureKey}`
      );
      await deleteFile(profilePictureKey).catch((err) =>
        logger.error("Rollback S3 delete failed: " + err)
      );
    }

    logger.error("Error Updating profile: " + e.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
