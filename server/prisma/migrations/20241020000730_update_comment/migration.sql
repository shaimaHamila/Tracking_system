/*
  Warnings:

  - You are about to drop the column `atachedFiles` on the `comment` table. All the data in the column will be lost.
  - You are about to drop the column `reatedAt` on the `comment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "comment" DROP COLUMN "atachedFiles",
DROP COLUMN "reatedAt",
ADD COLUMN     "attachedFiles" TEXT[],
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
