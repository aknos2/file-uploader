/*
  Warnings:

  - You are about to drop the column `publicId` on the `Data` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Data" DROP COLUMN "publicId",
ADD COLUMN     "path" TEXT;
