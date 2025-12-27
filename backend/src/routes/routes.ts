import { Router } from "express";
import AuthRouter from "../auth";
import profileRouter from "../profile";
import checkJWT from "../middleware/checkJWT";
import RefreshToken from "../middleware/RefreshRoute";
import { serveFile } from "../controllers/filesController";
import GigRouter from "../gigs";

const router = Router();

// 1. Files ko bilkul alag rakho (Public)
router.get("/files/:fileKey", serveFile);

// 2. Auth routes ko "/auth" ka prefix do (Public)
// Ab login ban jayega /auth/login
router.use("/auth", AuthRouter);

// 3. Refresh token (Public)
router.post("/refresh", RefreshToken);

// 4. Profile routes ko "/user" ya "/profile" ka prefix do (Secure)
// Ab update-profile ban jayega /profile/update-profile
router.use("/user", checkJWT, profileRouter);
router.use("/gigs", GigRouter);

export default router;
