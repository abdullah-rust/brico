/*
  Warnings:

  - You are about to drop the column `is_remote` on the `Gig` table. All the data in the column will be lost.
  - You are about to drop the column `service_areas` on the `Gig` table. All the data in the column will be lost.
  - You are about to drop the column `first_name` on the `User` table. All the data in the column will be lost.
  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `city` on the `Worker` table. All the data in the column will be lost.
  - Added the required column `availability` to the `Gig` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lat` to the `Gig` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lng` to the `Gig` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location_name` to the `Gig` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `Gig` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rateType` to the `Gig` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fullName` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Gig" DROP COLUMN "is_remote",
DROP COLUMN "service_areas",
ADD COLUMN     "availability" JSONB NOT NULL,
ADD COLUMN     "lat" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "lng" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "location_name" VARCHAR(255) NOT NULL,
ADD COLUMN     "phone" VARCHAR(15) NOT NULL,
ADD COLUMN     "rateType" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "first_name",
ADD COLUMN     "address" TEXT,
ADD COLUMN     "fullName" VARCHAR(100) NOT NULL,
ADD COLUMN     "phone_number" VARCHAR(15),
ADD COLUMN     "profile_picture" TEXT,
DROP COLUMN "role",
ADD COLUMN     "role" VARCHAR(20) DEFAULT 'CLIENT';

-- AlterTable
ALTER TABLE "Worker" DROP COLUMN "city";

-- DropEnum
DROP TYPE "Role";

-- CreateIndex
CREATE INDEX "Gig_lat_lng_idx" ON "Gig"("lat", "lng");
