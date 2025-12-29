import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import logger from "../utils/logger";
import { Prisma } from "../generated/prisma/client";

export default async function GetNearbyGigs(req: Request, res: Response) {
  try {
    const { lat, lng } = req.body;
    const { page = 1, limit = 20, category } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ message: "Coordinates are required!" });
    }

    const uLat = parseFloat(lat as string);
    const uLng = parseFloat(lng as string);
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    // 1. Dynamic Category Filter banayenge
    // Agar category 'All' nahi hai, toh SQL fragment add karenge
    const categoryFilter =
      category && category !== "All"
        ? Prisma.sql`AND g.category = ${category}`
        : Prisma.empty;

    // 2. Final Clean Query
    //
    const nearbyGigs: any[] = await prisma.$queryRaw`
      SELECT 
        g.id, 
        g.title as "gigTitle",        -- Gig ka title alag kar diya
        g.category, 
        g.price_base as "price",
        g.image_urls[1] as "firstImage",
        u."fullName" as "name",
        u.profile_picture as "image",
        u.role as "userRole",         -- User table wala role yahan se liya
        w.rating as "rating",
        (6371 * acos(
          cos(radians(${uLat})) * cos(radians(g.lat)) *
          cos(radians(g.lng) - radians(${uLng})) +
          sin(radians(${uLat})) * sin(radians(g.lat))
        )) AS distance
      FROM "Gig" g
      JOIN "User" u ON g.worker_id = u.id
      LEFT JOIN "Worker" w ON u.id = w.user_id
      WHERE g.is_active = true
      ${categoryFilter}
      ORDER BY distance ASC
      OFFSET ${skip}
      LIMIT ${take}
    `;

    const formattedWorkers = nearbyGigs.map((gig) => ({
      id: gig.id,
      name: gig.name,
      role: gig.userRole, // <--- Ab yahan profile wala role (e.g., MASON, ELECTRICIAN) aayega
      gigTitle: gig.gigTitle, // Agar card par title bhi dikhana ho toh ye use kar sakte ho
      category: gig.category,
      rating: gig.rating || 0,
      distance: gig.distance ? gig.distance.toFixed(1) + " km" : "0 km",
      price: gig.price ? gig.price.toString() : "0",
      available: true,
      image: gig.image || gig.firstImage || "",
    }));

    return res.status(200).json({
      success: true,
      data: formattedWorkers,
      metadata: { page: Number(page), count: formattedWorkers.length },
    });
  } catch (e: any) {
    logger.error("Nearby Gigs Error: " + e.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
