import { Request, Response, NextFunction } from "express";
import { verifyAccessToken, verifyRefreshToken } from "../utils/jwt";
import logger from "../utils/logger";

export default async function checkJWT(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // 1. Headers se tokens uthana
    const authHeader = req.headers.authorization; // "Bearer <token>"
    const refreshToken = req.headers["x-refresh-token"] as string;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No access token provided" });
    }

    const accessToken = authHeader.split(" ")[1];

    if (!accessToken) {
      return res.status(401).json({ message: "No access token provided" });
    }
    // 2. Access Token verify karna
    const accessPayload = await verifyAccessToken(accessToken);

    if (accessPayload) {
      // ✅ Token valid hai, userId attach karo aur aage bhejo
      (req as any).userId = accessPayload.userId;
      return next();
    }

    // 3. Agar Access Token invalid/expired hai
    logger.warn("Access token expired, checking refresh token...");

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token invalid" });
    }

    // 4. Refresh Token verify karna
    const refreshPayload = await verifyRefreshToken(refreshToken);

    if (!refreshPayload) {
      return res.status(403).json({ message: "Refresh token invalid" });
      // ✅ Ab dono jagah 403 hoga
    }

    return res.status(401).json({
      message: "Token expired",
      code: "ACCESS_TOKEN_EXPIRED",
    });
  } catch (error) {
    logger.error("Middleware Auth Error: " + error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
