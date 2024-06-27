import { Module } from '@nestjs/common';
import {
  GoogleDriveConfig,
  GoogleDriveModule,
} from 'nestjs-googledrive-upload';

import { PrismaService } from '@prisma/prisma.service';
import * as config from 'src/libs/config/google.config.json';

import { MeetupController } from './meetup.controller';
import { MeetupService } from './meetup.service';

@Module({
  controllers: [MeetupController],
  providers: [MeetupService, PrismaService],
  imports: [
    GoogleDriveModule.register(
      config as GoogleDriveConfig,
      '1capQ5ZRrSUcx0Folnai84X8kgGl4Pp40',
    ),
  ],
})
export class MeetupModule {}
