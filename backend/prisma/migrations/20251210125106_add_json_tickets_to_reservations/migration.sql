/*
  Warnings:

  - You are about to drop the column `price_id` on the `reservations` table. All the data in the column will be lost.
  - You are about to drop the column `tickets_count` on the `reservations` table. All the data in the column will be lost.
  - Added the required column `tickets` to the `reservations` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "reservations" DROP CONSTRAINT "reservations_price_id_fkey";

-- AlterTable
ALTER TABLE "reservations" DROP COLUMN "price_id",
DROP COLUMN "tickets_count",
ADD COLUMN     "tickets" JSONB NOT NULL;
