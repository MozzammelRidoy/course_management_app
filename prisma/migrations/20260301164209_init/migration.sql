-- CreateEnum
CREATE TYPE "CourseStatus" AS ENUM ('PENDING', 'ONGOING', 'ENDED');

-- AlterTable
ALTER TABLE "courses" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "status" "CourseStatus" NOT NULL DEFAULT 'ONGOING';

-- AlterTable
ALTER TABLE "results" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;
