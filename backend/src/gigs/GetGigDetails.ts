import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import logger from "../utils/logger";

export default async function GetGigDetails(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Gig ID is required, jani!" });
    }

    const gig = await prisma.gig.findUnique({
      where: { id: id },
      include: {
        worker: {
          include: {
            user: {
              select: {
                fullName: true,
                profilePicture: true,
                role: true, // <--- Yeh field zaroori hai (e.g. MASON, ELECTRICIAN)
              },
            },
          },
        },
      },
    });

    if (!gig) {
      return res.status(404).json({ message: "Gig not found!" });
    }

    return res.status(200).json({
      success: true,
      data: {
        id: gig.id,
        title: gig.title,
        description: gig.description,
        category: gig.category,
        priceBase: gig.priceBase,
        rateType: gig.rateType,
        locationName: gig.locationName,
        phone: gig.phone,
        imageUrls: gig.imageUrls,
        availability: gig.availability,
        worker: {
          rating: gig.worker.rating || 0,
          experience: gig.worker.experienceYears || "0",
          user: {
            fullName: gig.worker.user.fullName,
            // Yahan check karo ke agar image hai toh bheje, warna null ya default string
            profilePicture: gig.worker.user.profilePicture,
            role: gig.worker.user.role, // <--- Actual Professional Role
          },
        },
      },
    });
  } catch (error: any) {
    logger.error("Error in GetGigDetails: " + error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
