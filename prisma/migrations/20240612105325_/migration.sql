-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Admin', 'User');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "roles" "Role" NOT NULL DEFAULT 'User';
