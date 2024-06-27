import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { AuthModule } from './auth/auth.module';
import { MeetupModule } from './meetup/meetup.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    MeetupModule,
    AuthModule,
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
