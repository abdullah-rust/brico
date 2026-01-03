import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import logger from "../utils/logger";

export const getDesigns = async (req: Request, res: Response) => {
  try {
    // 1. Query Parameters nikaalo
    const {
      category,
      size,
      style,
      page = "1",
      limit = "10",
      search,
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    // 2. Dynamic Filter Object
    const whereClause: any = {};

    if (category) whereClause.category = category;
    if (size) whereClause.sizeTag = size;
    if (style) whereClause.styleTag = style;

    // Search logic (Title mein keyword dhoondne ke liye)
    if (search) {
      whereClause.OR = [
        { title: { contains: String(search), mode: "insensitive" } },
        { description: { contains: String(search), mode: "insensitive" } },
      ];
    }

    // 3. Database Query (Parallel execution for performance)
    const [designs, totalCount] = await Promise.all([
      prisma.designPost.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" }, // Newest first
        skip: skip,
        take: take,
      }),
      prisma.designPost.count({ where: whereClause }),
    ]);

    // 4. Response with Metadata
    return res.status(200).json({
      success: true,
      data: designs,
      pagination: {
        total: totalCount,
        page: Number(page),
        limit: take,
        totalPages: Math.ceil(totalCount / take),
      },
    });
  } catch (error: any) {
    logger.error("Get Designs Error: " + error.message);
    return res
      .status(500)
      .json({ message: "Server Error: Designs fetch nahi ho sakay" });
  }
};
