import {
  applyDecorators,
  HttpCode,
  HttpStatus,
  INestApplication,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiResponse,
  ApiTags,
  DocumentBuilder,
  SwaggerModule,
} from '@nestjs/swagger';
import { AuthDto, ChangeMeetupDto, MeetupDto } from '@dto';
import { JwtAuthGuard, RolesGuard } from '@modules/auth/guards';
import { Roles } from '@decorators/roles.decorator';

export class Config {
  static initialize(app: INestApplication) {
    const config = new DocumentBuilder()
      .setTitle('Meetup-api')
      .setVersion('3.0')
      .addBearerAuth()
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
        HttpCode(HttpStatus.CREATED),
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
        ApiBearerAuth(),
      );
    case 'update-tokens':
      return applyDecorators(
        ApiResponse({
          status: 201,
          description: 'User logged successfully',
        }),
        ApiResponse({ status: 400, description: 'Bad request.' }),
        UseGuards(JwtAuthGuard),
        ApiBearerAuth(),
      );

    case 'meetup':
      return UseGuards(JwtAuthGuard), ApiTags('meetup');

    case 'getAllMeetups':
      return applyDecorators(
        ApiResponse({
          status: 200,
          description: 'Meetups has been successfully found.',
        }),
        ApiResponse({ status: 404, description: 'Not Found' }),
      );

    case 'getMeetupById':
      return applyDecorators(
        ApiResponse({
          status: 200,
          description: 'The meetup has been successfully found.',
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
          type: ChangeMeetupDto,
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
        HttpCode(HttpStatus.NO_CONTENT),
      );
  }
}
