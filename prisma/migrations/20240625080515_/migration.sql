/*
  Warnings:

  - You are about to drop the `UserMeetup` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserMeetup" DROP CONSTRAINT "UserMeetup_meetupId_fkey";

-- DropForeignKey
ALTER TABLE "UserMeetup" DROP CONSTRAINT "UserMeetup_userId_fkey";

-- DropTable
DROP TABLE "UserMeetup";

-- CreateTable
CREATE TABLE "_MeetupMembers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_MeetupMembers_AB_unique" ON "_MeetupMembers"("A", "B");

-- CreateIndex
CREATE INDEX "_MeetupMembers_B_index" ON "_MeetupMembers"("B");

-- AddForeignKey
ALTER TABLE "_MeetupMembers" ADD CONSTRAINT "_MeetupMembers_A_fkey" FOREIGN KEY ("A") REFERENCES "Meetup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MeetupMembers" ADD CONSTRAINT "_MeetupMembers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
