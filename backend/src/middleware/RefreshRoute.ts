import { Request, Response } from "express";
import { verifyRefreshToken, createAccessToken } from "../utils/jwt";
import logger from "../utils/logger";

export default async function RefreshToken(req: Request, res: Response) {
  try {
    // 1. Header se Refresh Token nikalna
    const refreshToken = req.headers["x-refresh-token"] as string;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token missing" });
    }

    // 2. Refresh Token ko verify karna
    const payload = await verifyRefreshToken(refreshToken);

    if (!payload || !payload.userId) {
      logger.error("Invalid or expired refresh token");
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    // 3. Naya Access Token generate karna
    // Payload se humein userId mil jayegi jo humne token create karte waqt dali thi
    const newAccessToken = await createAccessToken(payload.userId);

    logger.info(`Token refreshed successfully for user: ${payload.userId}`);

    // 4. Response mein naya token bhejna
    return res.status(200).json({
      accessToken: newAccessToken,
    });
  } catch (error) {
    logger.error("Error in RefreshToken Controller: " + error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
