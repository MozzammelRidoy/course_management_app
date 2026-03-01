/*
  Warnings:

  - You are about to drop the column `isActive` on the `teacher_courses` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "teacher_courses" DROP COLUMN "isActive";

-- DropTable
DROP TABLE "User";
