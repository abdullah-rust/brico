import Router from "express";
import GetProfile from "./getProfile";
import UpdateProfile from "./profileUpdater";
import { upload } from "../middleware/multer";

const ProfileRouter = Router();

ProfileRouter.get("/profile", GetProfile);
ProfileRouter.post(
  "/update-profile",
  upload.single("profilePicture"),
  UpdateProfile
);

export default ProfileRouter;
