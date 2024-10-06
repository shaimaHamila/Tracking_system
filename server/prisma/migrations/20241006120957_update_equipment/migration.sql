/*
  Warnings:

  - You are about to drop the `equipment_category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `equipment_status` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[serialNumber]` on the table `equipment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "EquipmentCondition" AS ENUM ('OPERATIONAL', 'DAMAGED', 'UNDER_MAINTENANCE', 'REPAIRED');

-- DropForeignKey
ALTER TABLE "equipment" DROP CONSTRAINT "equipment_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "equipment" DROP CONSTRAINT "equipment_statusId_fkey";

-- AlterTable
ALTER TABLE "equipment" ADD COLUMN     "condition" "EquipmentCondition" NOT NULL DEFAULT 'OPERATIONAL',
ALTER COLUMN "categoryId" DROP NOT NULL;

-- DropTable
DROP TABLE "equipment_category";

-- DropTable
DROP TABLE "equipment_status";

-- DropEnum
DROP TYPE "equipmentCondition";

-- CreateTable
CREATE TABLE "equipmentCategory" (
    "id" SERIAL NOT NULL,
    "categoryName" TEXT NOT NULL,

    CONSTRAINT "equipmentCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "equipmentCategory_categoryName_key" ON "equipmentCategory"("categoryName");

-- CreateIndex
CREATE UNIQUE INDEX "equipment_serialNumber_key" ON "equipment"("serialNumber");

-- CreateIndex
CREATE INDEX "idx_serialNumber" ON "equipment"("serialNumber");

-- AddForeignKey
ALTER TABLE "equipment" ADD CONSTRAINT "equipment_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "equipmentCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
