import {
  HttpCode,
  HttpStatus,
  INestApplication,
  UseGuards,
  applyDecorators,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiOAuth2,
  ApiResponse,
  ApiTags,
  DocumentBuilder,
  SwaggerModule,
} from '@nestjs/swagger';

import { Roles } from '@libs/decorators';
import {
  AuthDto,
  ChangeMeetupDto,
  MeetupDto,
  PayloadDto,
  UserDto,
} from '@libs/dto';
import { GoogleGuard, JwtAuthGuard, RolesGuard } from '../../modules/auth/guards';

export class Config {
  static initialize(app: INestApplication) {
    const config = new DocumentBuilder()
      .setTitle('Meetup-api')
      .setVersion('3.0')
      .addBearerAuth()
      .addOAuth2()
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
          status: HttpStatus.CREATED,
          description: 'The record has been successfully created.',
        }),
        ApiResponse({
          status: HttpStatus.BAD_REQUEST,
          description: 'Bad request.',
        }),
        ApiBody({
          type: AuthDto,
          description: 'Json structure for user object',
        }),
        HttpCode(HttpStatus.CREATED),
      );

    case 'login':
      return applyDecorators(
        ApiResponse({
          status: HttpStatus.OK,
          description: 'User logged successfully',
        }),
        ApiResponse({
          status: HttpStatus.BAD_REQUEST,
          description: 'Bad request.',
        }),
        ApiBody({
          type: AuthDto,
          description: 'Json structure for user object',
        }),
        ApiBearerAuth(),
        HttpCode(HttpStatus.OK),
      );

    case 'update-tokens':
      return applyDecorators(
        ApiResponse({
          status: HttpStatus.CREATED,
          description: 'User logged successfully',
        }),
        ApiResponse({ status: 400, description: 'Bad request.' }),
        UseGuards(JwtAuthGuard),
        ApiBearerAuth(),
        HttpCode(HttpStatus.CREATED),
      );

    case 'google':
      return applyDecorators(
        ApiResponse({
          status: HttpStatus.CREATED,
          description: 'User logged successfully',
        }),
        UseGuards(GoogleGuard),
        ApiOAuth2(['google']),
        HttpCode(HttpStatus.CREATED),
      );

    case 'googleAuthCallback':
      return applyDecorators(
        ApiResponse({
          status: HttpStatus.CREATED,
          description: 'User logged successfully',
        }),
        UseGuards(GoogleGuard),
        ApiOAuth2(['google']),
        HttpCode(HttpStatus.CREATED),
      );

    case 'users':
      return applyDecorators(
        ApiExtraModels(UserDto),
        UseGuards(JwtAuthGuard),
        ApiTags('users'),
        ApiBearerAuth(),
      );

    case 'upload':
      return applyDecorators(
        ApiResponse({
          status: HttpStatus.CREATED,
          description: 'You have successfully uploaded image',
        }),
        ApiResponse({
          status: HttpStatus.BAD_REQUEST,
          description: 'Bad request',
        }),
        ApiResponse({
          status: HttpStatus.UNAUTHORIZED,
          description: 'UNAUTHORIZED',
        }),
        HttpCode(HttpStatus.CREATED),
      );

    case 'getImage':
      return applyDecorators(
        ApiResponse({
          status: HttpStatus.OK,
          description: 'You have successfully got the image',
        }),
        ApiResponse({
          status: HttpStatus.UNAUTHORIZED,
          description: 'UNAUTHORIZED',
        }),
        HttpCode(HttpStatus.OK),
      );

    case 'deleteImage':
      return applyDecorators(
        ApiResponse({
          status: HttpStatus.NO_CONTENT,
          description: 'The image has been successfully deleted.',
        }),
        ApiResponse({
          status: HttpStatus.UNAUTHORIZED,
          description: 'UNAUTHORIZED',
        }),
        ApiResponse({
          status: HttpStatus.BAD_REQUEST,
          description: 'Bad request',
        }),
        HttpCode(HttpStatus.NO_CONTENT),
      );

    case 'changeImage':
      return applyDecorators(
        ApiResponse({
          status: HttpStatus.CREATED,
          description: 'The image has been successfully deleted.',
        }),
        ApiResponse({
          status: HttpStatus.UNAUTHORIZED,
          description: 'UNAUTHORIZED',
        }),
        ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden' }),
        HttpCode(HttpStatus.CREATED),
      );

    case 'join':
      return applyDecorators(
        ApiResponse({
          status: HttpStatus.CREATED,
          description: 'You have successfully joined this meetup',
        }),
        ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found' }),
        ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden' }),
        ApiResponse({
          status: HttpStatus.BAD_REQUEST,
          description: 'Bad request',
        }),
      );

    case 'leave':
      return applyDecorators(
        ApiResponse({
          status: HttpStatus.NO_CONTENT,
          description: 'You have successfully leaved this meetup',
        }),
        ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found' }),
        ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden' }),
        ApiResponse({
          status: HttpStatus.BAD_REQUEST,
          description: 'Bad request',
        }),
        HttpCode(HttpStatus.NO_CONTENT),
      );

    case 'addParticipant':
      return applyDecorators(
        ApiResponse({
          status: HttpStatus.CREATED,
          description: 'You have successfully added user to this meetup',
        }),
        ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found' }),
        ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden' }),
        ApiResponse({
          status: HttpStatus.BAD_REQUEST,
          description: 'Bad request',
        }),
        HttpCode(HttpStatus.CREATED),
      );

    case 'removeParticipant':
      return applyDecorators(
        ApiResponse({
          status: HttpStatus.NO_CONTENT,
          description: 'You have successfully added user to this meetup',
        }),
        ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found' }),
        ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden' }),
        ApiResponse({
          status: HttpStatus.BAD_REQUEST,
          description: 'Bad request',
        }),
        HttpCode(HttpStatus.NO_CONTENT),
      );

    case 'meetup':
      return applyDecorators(
        ApiExtraModels(PayloadDto),
        UseGuards(JwtAuthGuard),
        ApiTags('meetup'),
        ApiBearerAuth(),
      );

    case 'getAllMeetups':
      return applyDecorators(
        ApiResponse({
          status: HttpStatus.NO_CONTENT,
          description: 'Meetups has been successfully found.',
        }),
        ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found' }),
      );

    case 'getMeetupById':
      return applyDecorators(
        ApiResponse({
          status: HttpStatus.OK,
          description: 'The meetup has been successfully found.',
        }),
        ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found' }),
      );

    case 'createMeetup':
      return applyDecorators(
        ApiResponse({
          status: HttpStatus.CREATED,
          description: 'The meetup has been successfully created.',
        }),
        ApiResponse({
          status: HttpStatus.BAD_REQUEST,
          description: 'Bad request',
        }),
        ApiBody({
          type: MeetupDto,
          description: 'Json structure for user object',
        }),
        HttpCode(HttpStatus.CREATED),
      );
    case 'changeMeetup':
      return applyDecorators(
        ApiResponse({
          status: HttpStatus.OK,
          description: 'The meetup has been successfully changed.',
        }),
        ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden' }),
        ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found' }),
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
          status: HttpStatus.OK,
          description: 'The meetup has been successfully deleted.',
        }),
        ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden' }),
        ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found' }),
        HttpCode(HttpStatus.NO_CONTENT),
      );
  }
}
