// controllers/filesController.ts
import { Request, Response } from "express";
import { getFile } from "../helpers/s3Helpers";
import logger from "../utils/logger";

export const serveFile = async (req: Request, res: Response) => {
  try {
    // req.params[0] wildcard ki value uthayega (e.g., "profile-pictures/abc.jpg")
    const { fileKey } = req.params;

    if (!fileKey) {
      return res.status(400).json({ message: "File key is required" });
    }

    const fileData = await getFile(fileKey);

    res.setHeader("Content-Type", fileData.contentType);
    // 'inline' ka matlab hai browser mein khulegi, 'attachment' ka matlab download hogi
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${fileKey.split("/").pop()}"`
    );

    // Cache control (Zaruri hai performance ke liye)
    res.setHeader("Cache-Control", "public, max-age=31536000");

    return res.send(fileData.buffer);
  } catch (error: any) {
    logger.error("Error serving file: " + error);
    return res.status(404).json({ message: "File not found" });
  }
};
