/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- DropTable
DROP TABLE "Post";

-- CreateTable
CREATE TABLE "Meetup" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "tags" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "place" TEXT NOT NULL,
    "authorId" INTEGER,

    CONSTRAINT "Meetup_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Meetup" ADD CONSTRAINT "Meetup_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
