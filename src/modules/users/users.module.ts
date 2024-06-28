import { Module } from '@nestjs/common';
import {
  GoogleDriveConfig,
  GoogleDriveModule,
} from 'nestjs-googledrive-upload';

import { PrismaService } from '@prisma/prisma.service';
import * as config from 'src/libs/config/google.config.json';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService],
  imports: [
    GoogleDriveModule.register(
      config as GoogleDriveConfig,
      '1capQ5ZRrSUcx0Folnai84X8kgGl4Pp40',
    ),
  ],
})
export class UsersModule {}
