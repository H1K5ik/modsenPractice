import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { AuthModule } from './auth/auth.module';
import { MeetupModule } from './meetup/meetup.module';

@Module({
  imports: [
    MeetupModule,
    AuthModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
