import { Module } from '@nestjs/common';

import { PrismaService } from '@libs/prisma/prisma.service';

import { MeetupController } from './meetup.controller';
import { MeetupService } from './meetup.service';

@Module({
  controllers: [MeetupController],
  providers: [MeetupService, PrismaService],
})
export class MeetupModule {}
