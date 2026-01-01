import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import logger from "../utils/logger";
import { uploadFile, deleteFile } from "../helpers/s3Helpers";

interface IDesignBody {
  title: string;
  description?: string;
  category: string;
  sizeTag: string;
  styleTag: string;
}

export default async function UploadDesign(req: Request, res: Response) {
  let uploadedFileKey: string | null = null;

  try {
    // 1. Manual Validation
    const { title, description, category, sizeTag, styleTag }: IDesignBody =
      req.body;
    const file = req.file; // Multer provide karta hai

    if (!file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    if (!title || !category || !sizeTag || !styleTag) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled" });
    }

    try {
      uploadedFileKey = await uploadFile({
        buffer: file.buffer,
        originalname: file.originalname,
        mimetype: file.mimetype,
      });
      logger.info(`File uploaded to S3: ${uploadedFileKey}`);
    } catch (s3Error) {
      logger.error("S3 Upload Step Failed: " + s3Error);
      return res
        .status(502)
        .json({ message: "Cloud storage error, please try again" });
    }

    // 3. Step 2: Save Metadata to Database
    const newDesign = await prisma.designPost.create({
      data: {
        title,
        description: description || null,
        category,
        sizeTag,
        styleTag,
        imageUrl: uploadedFileKey, // Storing the unique key
      },
    });

    // 4. Final Response
    logger.info(`Design successfully published! ID: ${newDesign.id}`);
    return res.status(201).json({
      success: true,
      message: "Design added successfully",
      data: newDesign,
    });
  } catch (error: any) {
    if (uploadedFileKey) {
      await deleteFile(uploadedFileKey);
      logger.warn(
        `Rollback: Deleted S3 file ${uploadedFileKey} because DB operation failed`
      );
    }

    logger.error("Full Upload Process Error: " + error.stack);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
