/*
  Warnings:

  - The primary key for the `project_team` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `staffId` on the `project_team` table. All the data in the column will be lost.
  - You are about to drop the column `test` on the `user` table. All the data in the column will be lost.
  - Added the required column `teamMemberId` to the `project_team` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "project_team" DROP CONSTRAINT "project_team_staffId_fkey";

-- AlterTable
ALTER TABLE "project_team" DROP CONSTRAINT "project_team_pkey",
DROP COLUMN "staffId",
ADD COLUMN     "teamMemberId" INTEGER NOT NULL,
ADD CONSTRAINT "project_team_pkey" PRIMARY KEY ("teamMemberId", "projectId");

-- AlterTable
ALTER TABLE "user" DROP COLUMN "test";

-- AddForeignKey
ALTER TABLE "project_team" ADD CONSTRAINT "project_team_teamMemberId_fkey" FOREIGN KEY ("teamMemberId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
