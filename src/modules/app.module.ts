import { Module } from '@nestjs/common';
import { MeetupModule } from './meetup/meetup.module';

@Module({
  imports: [MeetupModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
