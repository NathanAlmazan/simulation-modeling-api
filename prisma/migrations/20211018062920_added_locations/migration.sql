-- CreateTable
CREATE TABLE "Locations" (
    "id" SERIAL NOT NULL,
    "province" VARCHAR(100) NOT NULL,
    "city" VARCHAR(100) NOT NULL,

    CONSTRAINT "Locations_pkey" PRIMARY KEY ("id")
);
