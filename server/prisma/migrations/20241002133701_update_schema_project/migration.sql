/*
  Warnings:

  - You are about to drop the `project_user` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `userRole` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `projectType` on the `project` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `roleId` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ProjectType" AS ENUM ('INTERNAL', 'EXTERNAL');

-- DropForeignKey
ALTER TABLE "project_user" DROP CONSTRAINT "project_user_projectId_fkey";

-- DropForeignKey
ALTER TABLE "project_user" DROP CONSTRAINT "project_user_userId_fkey";

-- DropForeignKey
ALTER TABLE "userRole" DROP CONSTRAINT "userRole_roleId_fkey";

-- DropForeignKey
ALTER TABLE "userRole" DROP CONSTRAINT "userRole_userId_fkey";

-- AlterTable
ALTER TABLE "project" ADD COLUMN     "clientId" INTEGER,
DROP COLUMN "projectType",
ADD COLUMN     "projectType" "ProjectType" NOT NULL;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "roleId" INTEGER NOT NULL,
ADD COLUMN     "test" TEXT;

-- DropTable
DROP TABLE "project_user";

-- DropTable
DROP TABLE "userRole";

-- DropEnum
DROP TYPE "projectType";

-- CreateTable
CREATE TABLE "project_team" (
    "staffId" INTEGER NOT NULL,
    "projectId" INTEGER NOT NULL,

    CONSTRAINT "project_team_pkey" PRIMARY KEY ("staffId","projectId")
);

-- CreateTable
CREATE TABLE "project_manager" (
    "managerId" INTEGER NOT NULL,
    "projectId" INTEGER NOT NULL,

    CONSTRAINT "project_manager_pkey" PRIMARY KEY ("managerId","projectId")
);

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "user_role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_team" ADD CONSTRAINT "project_team_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_team" ADD CONSTRAINT "project_team_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_manager" ADD CONSTRAINT "project_manager_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_manager" ADD CONSTRAINT "project_manager_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
