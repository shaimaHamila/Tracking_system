/*
  Warnings:

  - You are about to drop the column `brand` on the `equipment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "equipment" DROP COLUMN "brand",
ADD COLUMN     "brandId" INTEGER;

-- CreateTable
CREATE TABLE "equipmentBrand" (
    "id" SERIAL NOT NULL,
    "brandName" TEXT NOT NULL,

    CONSTRAINT "equipmentBrand_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "equipmentBrand_brandName_key" ON "equipmentBrand"("brandName");

-- AddForeignKey
ALTER TABLE "equipment" ADD CONSTRAINT "equipment_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "equipmentBrand"("id") ON DELETE SET NULL ON UPDATE CASCADE;
