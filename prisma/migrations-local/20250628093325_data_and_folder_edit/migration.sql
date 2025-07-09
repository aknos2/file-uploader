/*
  Warnings:

  - You are about to drop the column `folderId` on the `Folder` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,name]` on the table `Folder` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Folder` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Folder" DROP CONSTRAINT "Folder_folderId_fkey";

-- DropIndex
DROP INDEX "Folder_folderId_idx";

-- DropIndex
DROP INDEX "Folder_folderId_name_key";

-- AlterTable
ALTER TABLE "Folder" DROP COLUMN "folderId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Folder_userId_idx" ON "Folder"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Folder_userId_name_key" ON "Folder"("userId", "name");

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
