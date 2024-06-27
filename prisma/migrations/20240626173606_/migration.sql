/*
  Warnings:

  - The primary key for the `GoogleImages` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `images` on the `Meetup` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "GoogleImages" DROP CONSTRAINT "GoogleImages_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "GoogleImages_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "GoogleImages_id_seq";

-- AlterTable
ALTER TABLE "Meetup" DROP COLUMN "images";
