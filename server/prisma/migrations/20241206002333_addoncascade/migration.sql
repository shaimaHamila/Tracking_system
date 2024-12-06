-- DropForeignKey
ALTER TABLE "comment" DROP CONSTRAINT "comment_ticketId_fkey";

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "ticket"("id") ON DELETE CASCADE ON UPDATE CASCADE;
