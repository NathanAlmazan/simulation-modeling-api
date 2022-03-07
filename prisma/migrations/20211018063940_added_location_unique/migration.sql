/*
  Warnings:

  - A unique constraint covering the columns `[city]` on the table `Locations` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Locations_city_key" ON "Locations"("city");
