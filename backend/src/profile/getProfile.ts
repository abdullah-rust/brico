// controllers/GetProfile.ts
import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import logger from "../utils/logger";

// Frontend-friendly interface
interface UserProfileResponse {
  id: string;
  fullName: string;
  email: string;
  role: string;
  profilePicture?: string | null;
  phoneNumber?: string | null;
  address?: string | null;
  bio?: string | null;
  skills: string[];
  rating: number;
  experienceYears: number;
  createdAt: string;
  updatedAt: string;
}

export default async function GetProfile(req: Request, res: Response) {
  try {
    const userId = (req as any).userId;
    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No User ID found" });
    }

    // Fetch user with worker profile if exists
    const userProfile = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        workerProfile: true,
      },
    });

    if (!userProfile) {
      return res.status(404).json({ message: "User profile not found" });
    }

    // Flatten workerProfile into top-level
    const responseData: UserProfileResponse = {
      id: userProfile.id,
      fullName: userProfile.fullName,
      email: userProfile.email,
      role: userProfile.role ?? "CLIENT",
      profilePicture: userProfile.profilePicture ?? null,
      phoneNumber: userProfile.phoneNumber ?? null,
      address: userProfile.address ?? null,
      bio: userProfile.workerProfile?.bio ?? null,
      skills: userProfile.workerProfile?.skills ?? [],
      rating: userProfile.workerProfile?.rating ?? 0,
      experienceYears: userProfile.workerProfile?.experienceYears ?? 0,
      createdAt: userProfile.createdAt.toISOString(),
      updatedAt: userProfile.updatedAt.toISOString(),
    };

    logger.info(`Profile fetched for user: ${userId}`);
    return res.status(200).json(responseData);
  } catch (error) {
    logger.error("Error Fetching Profile: " + error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
