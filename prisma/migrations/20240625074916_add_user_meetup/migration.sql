-- AlterTable
ALTER TABLE "Meetup" ALTER COLUMN "place" SET DEFAULT 'office';

-- CreateTable
CREATE TABLE "UserMeetup" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "meetupId" INTEGER NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserMeetup_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserMeetup" ADD CONSTRAINT "UserMeetup_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserMeetup" ADD CONSTRAINT "UserMeetup_meetupId_fkey" FOREIGN KEY ("meetupId") REFERENCES "Meetup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
