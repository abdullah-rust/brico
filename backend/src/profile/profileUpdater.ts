import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import logger from "../utils/logger";
import { uploadFile } from "../helpers/s3Helpers";

interface EditProfileData {
  fullName: string;
  phoneNumber: string;
  address: string;
  bio: string;
  skills: string[];
  experienceYears: number;
}

export default async function UpdateProfile(req: Request, res: Response) {
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
    }: EditProfileData = req.body;

    let profilePictureKey: string | undefined;

    if (req.file) {
      profilePictureKey = await uploadFile(req.file);
    }

    if (!fullName) {
      return res.status(400).json({ message: "Full Name is required" });
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        fullName,
        phoneNumber,
        address,
        ...(profilePictureKey && {
          profilePicture: profilePictureKey,
        }),
      },
    });

    await prisma.worker.upsert({
      where: { userId },
      create: {
        userId,
        bio,
        skills, // Agar skills array hai toh theek, warna yahan bhi JSON.parse lag sakta hai
        experienceYears: parseInt(experienceYears as any) || 0, // ✅ String ko Number mein convert kiya
        profession: "UNKNOWN",
      },
      update: {
        bio,
        skills,
        experienceYears: parseInt(experienceYears as any) || 0, // ✅ Yahan bhi conversion
      },
    });
    return res.status(200).json({ message: "Profile updated successfully" });
  } catch (e) {
    logger.error("Error Updating profile" + e);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
