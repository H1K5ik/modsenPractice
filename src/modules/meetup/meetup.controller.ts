import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MeetupService } from './meetup.service';
import { MeetupDto } from './dto/meetup.dto';
import { QueryDto } from './dto/query.dto';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUserId } from 'src/libs/decorators/userid.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from 'src/libs/decorators/roles.decorator';

@ApiTags('meetup')
@Controller('meetup')
@UseGuards(JwtAuthGuard)
export class MeetupController {
  constructor(private readonly meetupService: MeetupService) {}

  @ApiResponse({
    status: 200,
    description: 'Meetups has been successfully created. found found',
  })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @Get()
  async getAllMeetups(@Query() query: QueryDto): Promise<MeetupDto[]> {
    return await this.meetupService.getAllMeetups(query);
  }

  @ApiResponse({
    status: 200,
    description: 'The meetup has been successfully created. found',
  })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @Get(':id')
  async getMeeupById(@Param('id') id: number): Promise<MeetupDto> {
    return await this.meetupService.getMeeupById(id);
  }

  @ApiResponse({
    status: 201,
    description: 'The meetup has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiBody({
    type: MeetupDto,
    description: 'Json structure for user object',
  })
  @Post('create')
  async ceateMeetup(
    @GetUserId('id') id: number,
    @Body() dto: MeetupDto,
  ): Promise<MeetupDto> {
    return await this.meetupService.createMeetup(id, dto);
  }

  @ApiResponse({
    status: 200,
    description: 'The meetup has been successfully changed.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiBody({
    type: MeetupDto,
    description: 'Json structure for user object',
  })
  @UseGuards(RolesGuard)
  @Roles('Admin')
  @Patch('change/:id')
  async changeMeetup(
    @GetUserId('id') userId: number,
    @Param('id') id: number,
    @Body() dto: MeetupDto,
  ): Promise<MeetupDto> {
    return await this.meetupService.changeMeetup(userId, id, dto);
  }

  @ApiResponse({
    status: 200,
    description: 'The meetup has been successfully deleted.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @Delete('delete/:id')
  async deleteMeetup(
    @GetUserId('id') userId: number,
    @Param('id') id: number,
  ): Promise<MeetupDto> {
    return await this.meetupService.deleteMeetup(userId, id);
  }
}
