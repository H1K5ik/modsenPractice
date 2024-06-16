import { applyDecorators, INestApplication, UseGuards } from '@nestjs/common';
import {
  ApiBody,
  ApiCookieAuth,
  ApiResponse,
  ApiTags,
  DocumentBuilder,
  SwaggerModule,
} from '@nestjs/swagger';
import { AuthDto } from '@modules/auth/dto';
import { MeetupDto } from '@modules/meetup/dto';
import { JwtAuthGuard, RolesGuard } from '@modules/auth/guards';
import { Roles } from '@decorators/roles.decorator';

export class Config {
  static initialize(app: INestApplication) {
    const config = new DocumentBuilder()
      .setTitle('Meetup-api')
      .addCookieAuth('optional-session-id')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }
}

export function ApiResponseAndBody(type: string) {
  switch (type) {
    case 'register':
      return applyDecorators(
        ApiResponse({
          status: 201,
          description: 'The record has been successfully created.',
        }),
        ApiResponse({ status: 400, description: 'Bad request.' }),
        ApiBody({
          type: AuthDto,
          description: 'Json structure for user object',
        }),
      );

    case 'login':
      return applyDecorators(
        ApiResponse({
          status: 201,
          description: 'User logged successfully',
        }),
        ApiResponse({ status: 400, description: 'Bad request.' }),
        ApiBody({
          type: AuthDto,
          description: 'Json structure for user object',
        }),
        ApiCookieAuth(),
      );
    case 'update-tokens':
      return applyDecorators(
        ApiResponse({
          status: 201,
          description: 'User logged successfully',
        }),
        ApiResponse({ status: 400, description: 'Bad request.' }),
        UseGuards(JwtAuthGuard),
        ApiCookieAuth(),
      );

    case 'meetup':
      return ApiTags('meetup'), UseGuards(JwtAuthGuard), ApiCookieAuth();

    case 'getAllMeetups':
      return applyDecorators(
        ApiResponse({
          status: 200,
          description: 'Meetups has been successfully created. found found',
        }),
        ApiResponse({ status: 404, description: 'Not Found' }),
      );

    case 'getMeetupById':
      return applyDecorators(
        ApiResponse({
          status: 200,
          description: 'The meetup has been successfully created. found',
        }),
        ApiResponse({ status: 404, description: 'Not Found' }),
      );
    case 'createMeetup':
      return applyDecorators(
        ApiResponse({
          status: 201,
          description: 'The meetup has been successfully created.',
        }),
        ApiResponse({ status: 400, description: 'Bad request' }),
        ApiBody({
          type: MeetupDto,
          description: 'Json structure for user object',
        }),
      );
    case 'changeMeetup':
      return applyDecorators(
        ApiResponse({
          status: 200,
          description: 'The meetup has been successfully changed.',
        }),
        ApiResponse({ status: 403, description: 'Forbidden' }),
        ApiResponse({ status: 404, description: 'Not Found' }),
        ApiBody({
          type: MeetupDto,
          description: 'Json structure for user object',
        }),
        UseGuards(RolesGuard),
        Roles('Admin'),
      );
    case 'deleteMeetup':
      return applyDecorators(
        ApiResponse({
          status: 200,
          description: 'The meetup has been successfully deleted.',
        }),
        ApiResponse({ status: 403, description: 'Forbidden' }),
        ApiResponse({ status: 404, description: 'Not found' }),
      );
  }
}
