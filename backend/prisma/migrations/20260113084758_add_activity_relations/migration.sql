-- CreateTable
CREATE TABLE "activity_relations" (
    "id" SERIAL NOT NULL,
    "activity_id" INTEGER NOT NULL,
    "related_activity_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_relations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "activity_relations_activity_id_related_activity_id_key" ON "activity_relations"("activity_id", "related_activity_id");

-- AddForeignKey
ALTER TABLE "activity_relations" ADD CONSTRAINT "activity_relations_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "activities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_relations" ADD CONSTRAINT "activity_relations_related_activity_id_fkey" FOREIGN KEY ("related_activity_id") REFERENCES "activities"("id") ON DELETE CASCADE ON UPDATE CASCADE;
