-- AlterEnum
ALTER TYPE "ticketType" ADD VALUE 'OTHER';

-- AlterTable
ALTER TABLE "equipment" ADD COLUMN     "description" TEXT,
ALTER COLUMN "name" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ticket" ADD COLUMN     "equipmentId" INTEGER;

-- AddForeignKey
ALTER TABLE "ticket" ADD CONSTRAINT "ticket_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "equipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
