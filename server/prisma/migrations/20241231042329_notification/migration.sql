-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('COMMENT', 'TICKET_CREATED', 'TICKET_UPDATED', 'TICKET_DELETED', 'TICKET_STATUS_CHANGED', 'TICKET_ASSIGNED', 'PROJECT_ASSIGNED', 'OTHER');

-- CreateTable
CREATE TABLE "notification" (
    "id" SERIAL NOT NULL,
    "recipientId" INTEGER NOT NULL,
    "senderId" INTEGER NOT NULL,
    "unread" BOOLEAN NOT NULL DEFAULT true,
    "type" "NotificationType" NOT NULL,
    "message" TEXT NOT NULL,
    "referenceId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notification_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
