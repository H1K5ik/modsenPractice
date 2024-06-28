/*
  Warnings:

  - You are about to drop the `GoogleImages` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `profileImage` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profileImageId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "profileImage" TEXT NOT NULL,
ADD COLUMN     "profileImageId" TEXT NOT NULL;

-- DropTable
DROP TABLE "GoogleImages";
