import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import logger from "../utils/logger";
import { uploadFile, deleteFile } from "../helpers/s3Helpers";
import { Prisma } from "../generated/prisma/client";

export default async function PublishGig(req: Request, res: Response) {
  let imageKeys: string[] = [];

  try {
    const userId = (req as any).userId;

    if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
      return res
        .status(400)
        .json({ message: "Please upload minimum 1 image!" });
    }

    // 1. Destructure availability from req.body
    const {
      title,
      category,
      description,
      priceBase,
      lat,
      lng,
      locationName,
      phone,
      rateType,
      availability, // <--- Frontend se JSON string aaye gi
    } = req.body;

    // Validation (Availability ko bhi check kar lete hain)
    if (
      !title ||
      !category ||
      !description ||
      !priceBase ||
      !lat ||
      !lng ||
      !locationName ||
      !phone ||
      !rateType ||
      !availability
    ) {
      return res
        .status(400)
        .json({ message: "All fields including schedule are required, jani!" });
    }

    // 2. JSON Parse Availability
    let parsedAvailability;
    try {
      parsedAvailability = JSON.parse(availability);
    } catch (parseErr) {
      return res.status(400).json({ message: "Invalid availability format!" });
    }

    const files = req.files as Express.Multer.File[];

    // 3. Parallel Upload to S3
    const uploadPromises = files.map((file) =>
      uploadFile({
        buffer: file.buffer,
        originalname: file.originalname,
        mimetype: file.mimetype,
      })
    );

    imageKeys = await Promise.all(uploadPromises);
    logger.info(`Images uploaded to S3. Keys: ${imageKeys.join(", ")}`);

    // 4. Save to Database
    const newGig = await prisma.gig.create({
      data: {
        workerId: userId,
        title,
        description,
        category,
        priceBase: new Prisma.Decimal(priceBase),
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        locationName: locationName,
        phone: phone,
        rateType: rateType,
        imageUrls: imageKeys,
        availability: parsedAvailability, // <--- Ye ab DB mein JSON ban kar jaye ga
      },
    });

    return res.status(200).json({
      success: true,
      message: "Gig Published Successfully",
      gigId: newGig.id,
    });
  } catch (e: any) {
    // 5. ROLLBACK LOGIC (Always clean up S3 if DB fails)
    if (imageKeys.length > 0) {
      logger.warn(
        `Database operation failed. Cleaning up ${imageKeys.length} images.`
      );
      imageKeys.forEach(async (key) => {
        try {
          await deleteFile(key);
        } catch (delErr) {
          logger.error(`Failed to delete ${key}: ${delErr}`);
        }
      });
    }

    logger.error("Error Publishing Gig: " + e.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
