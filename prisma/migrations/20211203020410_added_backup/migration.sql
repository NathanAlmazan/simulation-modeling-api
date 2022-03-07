-- CreateTable
CREATE TABLE "BackupLibrary" (
    "id" SERIAL NOT NULL,
    "file_name" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BackupLibrary_pkey" PRIMARY KEY ("id")
);
