/*
  Warnings:

  - You are about to drop the column `receipt_file` on the `Purchase` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Payables" ADD COLUMN     "receipt_file" VARCHAR(100);

-- AlterTable
ALTER TABLE "Purchase" DROP COLUMN "receipt_file";
