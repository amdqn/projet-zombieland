-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'CLIENT');

-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PriceType" AS ENUM ('ETUDIANT', 'ADULTE', 'GROUPE', 'PASS_2J');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "pseudo" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'CLIENT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attractions" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "attractions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attraction_images" (
    "id" SERIAL NOT NULL,
    "attraction_id" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "alt_text" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "attraction_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activities" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category_id" INTEGER NOT NULL,
    "attraction_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "park_dates" (
    "id" SERIAL NOT NULL,
    "jour" DATE NOT NULL,
    "is_open" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "park_dates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prices" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "type" "PriceType" NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "duration_days" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "prices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservations" (
    "id" SERIAL NOT NULL,
    "reservation_number" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "date_id" INTEGER NOT NULL,
    "price_id" INTEGER NOT NULL,
    "tickets_count" INTEGER NOT NULL,
    "total_amount" DECIMAL(10,2) NOT NULL,
    "status" "ReservationStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reservations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_pseudo_key" ON "users"("pseudo");

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "park_dates_jour_key" ON "park_dates"("jour");

-- CreateIndex
CREATE UNIQUE INDEX "reservations_reservation_number_key" ON "reservations"("reservation_number");

-- AddForeignKey
ALTER TABLE "attractions" ADD CONSTRAINT "attractions_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attraction_images" ADD CONSTRAINT "attraction_images_attraction_id_fkey" FOREIGN KEY ("attraction_id") REFERENCES "attractions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_attraction_id_fkey" FOREIGN KEY ("attraction_id") REFERENCES "attractions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_date_id_fkey" FOREIGN KEY ("date_id") REFERENCES "park_dates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_price_id_fkey" FOREIGN KEY ("price_id") REFERENCES "prices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
