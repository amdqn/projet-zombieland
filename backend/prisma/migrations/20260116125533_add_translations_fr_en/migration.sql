-- AlterTable
ALTER TABLE "activities" ADD COLUMN     "description_en" TEXT,
ADD COLUMN     "name_en" TEXT;

-- AlterTable
ALTER TABLE "attraction_images" ADD COLUMN     "alt_text_en" TEXT;

-- AlterTable
ALTER TABLE "attractions" ADD COLUMN     "description_en" TEXT,
ADD COLUMN     "name_en" TEXT;

-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "description_en" TEXT,
ADD COLUMN     "name_en" TEXT;

-- AlterTable
ALTER TABLE "points_of_interest" ADD COLUMN     "description_en" TEXT,
ADD COLUMN     "name_en" TEXT;

-- AlterTable
ALTER TABLE "prices" ADD COLUMN     "label_en" TEXT;
