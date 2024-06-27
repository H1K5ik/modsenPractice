-- AlterTable
ALTER TABLE "Meetup" ADD COLUMN     "images" TEXT[];

-- CreateTable
CREATE TABLE "GoogleImages" (
    "id" SERIAL NOT NULL,
    "images" TEXT[],

    CONSTRAINT "GoogleImages_pkey" PRIMARY KEY ("id")
);
