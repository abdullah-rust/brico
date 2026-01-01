import { Request, Response, NextFunction } from "express";
import { verifyAdminAccessToken } from "../utils/jwt";
import { prisma } from "../lib/prisma";
import logger from "../utils/logger";

export const adminProtect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "No token provided, access denied" });
    }

    const decoded = await verifyAdminAccessToken(token);

    if (!decoded || !decoded.userId) {
      return res
        .status(403)
        .json({ message: "Invalid or expired admin token" });
    }

    const admin = await prisma.admin.findUnique({
      where: { username: decoded.userId },
      select: { id: true, username: true },
    });

    if (!admin) {
      logger.warn(
        `Unauthorised access attempt with username: ${decoded.userId}`
      );
      return res.status(403).json({ message: "Forbidden: Admin access only" });
    }

    (req as any).admin = admin;

    return next();
  } catch (error: any) {
    logger.error("Admin Middleware Error: " + error.message);
    return res.status(500).json({ message: "Internal Auth Error" });
  }
};
