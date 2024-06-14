import { Module } from '@nestjs/common';
import { MeetupModule } from './meetup/meetup.module';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';

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
