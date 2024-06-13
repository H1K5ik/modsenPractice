import { applyDecorators, Controller, UseGuards } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../modules/auth/guards/jwt-auth.guard';
import { AuthDto } from '../../modules/auth/dto/auth.dto';
import { MeetupDto } from '../../modules/meetup/dto/meetup.dto';
import { RolesGuard } from '../../modules/auth/guards/roles.guard';
import { Roles } from '@decorators/roles.decorator';

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
      );
    case 'update-tokens':
      return applyDecorators(
        ApiResponse({
          status: 201,
          description: 'User logged successfully',
        }),
        ApiResponse({ status: 400, description: 'Bad request.' }),
        UseGuards(JwtAuthGuard),
      );

    case 'meetup':
      return ApiTags('meetup'), UseGuards(JwtAuthGuard);

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
