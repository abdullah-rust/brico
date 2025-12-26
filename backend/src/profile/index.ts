import Router from "express";
import GetProfile from "./getProfile";
import UpdateProfile from "./profileUpdater";
import { upload } from "../middleware/multer";

const profileRouter = Router();

profileRouter.get("/profile", GetProfile);
profileRouter.post(
  "/update-profile",
  upload.single("profilePicture"),
  UpdateProfile
);

export default profileRouter;
