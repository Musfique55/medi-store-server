-- CreateEnum
CREATE TYPE "user_status" AS ENUM ('ban', 'unban');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "phone" TEXT,
ADD COLUMN     "status" "user_status" NOT NULL DEFAULT 'unban';
