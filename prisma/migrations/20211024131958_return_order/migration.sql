/*
  Warnings:

  - You are about to drop the column `is_returned` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "is_returned";

-- AlterTable
ALTER TABLE "OrderWithProduct" ADD COLUMN     "is_returned" BOOLEAN NOT NULL DEFAULT false;
