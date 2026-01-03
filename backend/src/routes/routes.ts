import { Router } from "express";
import AuthRouter from "../auth";
import ProfileRouter from "../profile";
import checkJWT from "../middleware/checkJWT";
import RefreshToken from "../middleware/RefreshRoute";
import { serveFile } from "../controllers/filesController";
import GigRouter from "../gigs";
import AdminRoutes from "../admin";
import DesignRouter from "../designs";

const router = Router();

router.use("/design", DesignRouter);

router.use("/admin", AdminRoutes);

router.get("/files/:fileKey", serveFile);

router.use("/auth", AuthRouter);

router.post("/refresh", RefreshToken);

router.use("/user", checkJWT, ProfileRouter);
router.use("/gigs", GigRouter);

export default router;
