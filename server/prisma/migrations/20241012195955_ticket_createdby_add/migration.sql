-- AlterTable
ALTER TABLE "ticket" ADD COLUMN     "createdById" INTEGER,
ALTER COLUMN "type" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "ticket" ADD CONSTRAINT "ticket_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
