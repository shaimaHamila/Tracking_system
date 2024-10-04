-- DropForeignKey
ALTER TABLE "project_manager" DROP CONSTRAINT "project_manager_projectId_fkey";

-- DropForeignKey
ALTER TABLE "project_team" DROP CONSTRAINT "project_team_projectId_fkey";

-- DropForeignKey
ALTER TABLE "ticket" DROP CONSTRAINT "ticket_projectId_fkey";

-- AddForeignKey
ALTER TABLE "project_team" ADD CONSTRAINT "project_team_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_manager" ADD CONSTRAINT "project_manager_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket" ADD CONSTRAINT "ticket_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
