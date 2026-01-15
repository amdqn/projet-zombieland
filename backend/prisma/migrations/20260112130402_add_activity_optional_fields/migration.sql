-- AlterTable
ALTER TABLE "activities" ADD COLUMN     "accessibility" TEXT,
ADD COLUMN     "is_published" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "min_age" INTEGER;
