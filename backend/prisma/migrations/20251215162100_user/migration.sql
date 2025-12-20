-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CLIENT', 'WORKER', 'ADMIN');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'CLIENT',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Worker" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "profession" VARCHAR(100) NOT NULL,
    "bio" TEXT,
    "experience_years" INTEGER NOT NULL,
    "rating" REAL NOT NULL DEFAULT 0.0,
    "skills" TEXT[],
    "city" VARCHAR(100),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "Worker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Gig" (
    "id" UUID NOT NULL,
    "worker_id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "category" VARCHAR(100) NOT NULL,
    "price_base" DECIMAL(10,2) NOT NULL,
    "is_remote" BOOLEAN NOT NULL DEFAULT false,
    "service_areas" TEXT[],
    "image_urls" TEXT[],
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "Gig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Worker_user_id_key" ON "Worker"("user_id");

-- CreateIndex
CREATE INDEX "Gig_category_idx" ON "Gig"("category");

-- CreateIndex
CREATE INDEX "Gig_worker_id_idx" ON "Gig"("worker_id");

-- AddForeignKey
ALTER TABLE "Worker" ADD CONSTRAINT "Worker_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gig" ADD CONSTRAINT "Gig_worker_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "Worker"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
