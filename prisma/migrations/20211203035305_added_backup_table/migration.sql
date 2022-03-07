/*
  Warnings:

  - Added the required column `table_name` to the `BackupLibrary` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BackupLibrary" ADD COLUMN     "table_name" VARCHAR(100) NOT NULL;
