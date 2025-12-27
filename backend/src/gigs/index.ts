import { Router } from "express";
import multer from "multer";
import PublishGig from "./publishGig";
import checkJWT from "../middleware/checkJWT";

const GigRouter = Router();

// 1. Multer Configuration (Memory Storage use kar rahe hain S3 ke liye)
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit per image
  },
  fileFilter: (_req, file, cb) => {
    // Sirf images allow karne ke liye
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed!") as any, false);
    }
  },
});

// 2. Route Definition
// "portfolio" wahi name hai jo tumhare frontend (formData) mein hai
GigRouter.post("/publish", checkJWT, upload.array("portfolio", 5), PublishGig);

export default GigRouter;
