import { Router } from "express";
import multer from "multer";
import UploadDesign from "./addDesign";
import { adminProtect } from "../middleware/adminAuth";
import { getDesigns } from "./getDesign";

const DesignRouter = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});
DesignRouter.post(
  "/add-design",
  adminProtect,
  upload.single("image"),
  UploadDesign
);
DesignRouter.get("/get-designs", getDesigns);

export default DesignRouter;
