import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import logger from "../utils/logger";
import { uploadFile, deleteFile } from "../helpers/s3Helpers"; // Delete function import kiya
import { Prisma } from "../generated/prisma/client";

export default async function PublishGig(req: Request, res: Response) {
  // imageKeys ko top level par rakha hai taake 'catch' block isse access kar sake
  let imageKeys: string[] = [];

  try {
    const userId = (req as any).userId;

    // 1. Files aur Data Check (Sab se pehle validation taake upload fuzool na ho)
    if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
      return res
        .status(400)
        .json({ message: "Please upload minimum 1 image!" });
    }

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
    } = req.body;

    if (
      !title ||
      !category ||
      !description ||
      !priceBase ||
      !lat ||
      !lng ||
      !locationName ||
      !phone ||
      !rateType
    ) {
      return res
        .status(400)
        .json({ message: "All fields are required, jani!" });
    }

    const files = req.files as Express.Multer.File[];

    // 2. Parallel Upload to S3
    //
    const uploadPromises = files.map((file) =>
      uploadFile({
        buffer: file.buffer,
        originalname: file.originalname,
        mimetype: file.mimetype,
      })
    );

    imageKeys = await Promise.all(uploadPromises);
    logger.info(`Images uploaded to S3. Keys: ${imageKeys.join(", ")}`);

    // 3. Save to Database
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
        serviceAreas: [locationName],
        imageUrls: imageKeys,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Gig Published Successfully",
      gigId: newGig.id,
    });
  } catch (e: any) {
    // 4. ROLLBACK LOGIC: Agar DB fail hua toh S3 se images urha do
    //
    if (imageKeys.length > 0) {
      logger.warn(
        `Database operation failed Cleaning up ${imageKeys.length} images from S3.`
      );

      // Images delete karne ka process (Async but no need to wait for response in main flow)
      imageKeys.forEach(async (key) => {
        try {
          await deleteFile(key);
          logger.info(`Successfully rolled back/deleted: ${key}`);
        } catch (delErr) {
          logger.error(`Failed to delete ${key} during rollback: ${delErr}`);
        }
      });
    }

    logger.error("Error Publishing Gig: " + e.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
