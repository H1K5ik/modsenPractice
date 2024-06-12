import { Module } from '@nestjs/common';
import { MeetupModule } from './meetup/meetup.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [MeetupModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
