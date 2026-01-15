-- AlterTable
ALTER TABLE "attractions" ADD COLUMN     "is_published" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "attraction_relations" (
    "id" SERIAL NOT NULL,
    "attraction_id" INTEGER NOT NULL,
    "related_attraction_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "attraction_relations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "attraction_relations_attraction_id_related_attraction_id_key" ON "attraction_relations"("attraction_id", "related_attraction_id");

-- AddForeignKey
ALTER TABLE "attraction_relations" ADD CONSTRAINT "attraction_relations_attraction_id_fkey" FOREIGN KEY ("attraction_id") REFERENCES "attractions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attraction_relations" ADD CONSTRAINT "attraction_relations_related_attraction_id_fkey" FOREIGN KEY ("related_attraction_id") REFERENCES "attractions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
