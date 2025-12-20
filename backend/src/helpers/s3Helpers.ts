import s3 from "../configs/s3Client";
import {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  PutObjectCommandOutput,
  DeleteObjectCommandOutput,
} from "@aws-sdk/client-s3";
import logger from "../utils/logger";
import { UploadFileInput, GetFileResult } from "../types/S3Helper";

// ============================
// 1. UPLOAD FILE FUNCTION
// ============================
export const uploadFile = async (
  file: UploadFileInput,
  folder: string = "uploads"
): Promise<string> => {
  if (!file || !file.buffer) {
    throw new Error("Invalid file provided");
  }

  // Generate unique file key
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 10);
  const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "-");
  const fileKey = `${folder}/${timestamp}-${random}-${sanitizedName}`;

  // Upload to S3
  const command = new PutObjectCommand({
    Bucket: process.env["S3_BUCKET"] as string,
    Key: fileKey,
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  const response: PutObjectCommandOutput = await s3.send(command);

  logger.info("file added " + response);

  // Return ONLY the file key
  return fileKey;
};

// ============================
// 2. GET FILE FUNCTION
// ============================
export const getFile = async (fileKey: string): Promise<GetFileResult> => {
  if (!fileKey || typeof fileKey !== "string") {
    throw new Error("Valid file key is required");
  }

  const command = new GetObjectCommand({
    Bucket: process.env["S3_BUCKET"] as string,
    Key: fileKey,
  });

  const response = await s3.send(command);

  // Convert stream to Buffer
  const chunks: Uint8Array[] = [];

  // Response.Body is a Readable stream
  for await (const chunk of response.Body as any) {
    chunks.push(chunk);
  }

  const buffer = Buffer.concat(chunks);

  return {
    buffer: buffer,
    contentType: response.ContentType || "application/octet-stream",
  };
};

// ============================
// 3. DELETE FILE FUNCTION
// ============================
export const deleteFile = async (fileKey: string): Promise<boolean> => {
  if (!fileKey || typeof fileKey !== "string") {
    throw new Error("Valid file key is required");
  }

  const command = new DeleteObjectCommand({
    Bucket: process.env["S3_BUCKET"] as string,
    Key: fileKey,
  });

  const response: DeleteObjectCommandOutput = await s3.send(command);
  logger.info("file deleted " + response);

  return true;
};
