/*
  Warnings:

  - You are about to drop the column `assignedToId` on the `ticket` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ticket" DROP CONSTRAINT "ticket_assignedToId_fkey";

-- AlterTable
ALTER TABLE "project" ADD COLUMN     "technicalManagerId" INTEGER;

-- AlterTable
ALTER TABLE "ticket" DROP COLUMN "assignedToId";

-- CreateTable
CREATE TABLE "user_ticket" (
    "userId" INTEGER NOT NULL,
    "ticketId" INTEGER NOT NULL,

    CONSTRAINT "user_ticket_pkey" PRIMARY KEY ("userId","ticketId")
);

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_technicalManagerId_fkey" FOREIGN KEY ("technicalManagerId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_ticket" ADD CONSTRAINT "user_ticket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_ticket" ADD CONSTRAINT "user_ticket_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "ticket"("id") ON DELETE CASCADE ON UPDATE CASCADE;
