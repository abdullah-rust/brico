-- CreateTable
CREATE TABLE "DesignPost" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "sizeTag" TEXT NOT NULL,
    "styleTag" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DesignPost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DesignPost_category_idx" ON "DesignPost"("category");

-- CreateIndex
CREATE INDEX "DesignPost_sizeTag_styleTag_idx" ON "DesignPost"("sizeTag", "styleTag");
