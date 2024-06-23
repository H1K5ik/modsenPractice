import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { ApiResponseAndBody } from '@config/config';
import { GetUserId } from '@decorators/userid.decorator';
import { ChangeMeetupDto, MeetupDto, QueryDto } from '@dto';

import { MeetupService } from './meetup.service';

@ApiResponseAndBody('meetup')
@Controller('meetup')
export class MeetupController {
  constructor(private readonly meetupService: MeetupService) {}

  @ApiResponseAndBody('getAllMeetups')
  @Get()
  async getAllMeetups(@Query() query: QueryDto): Promise<MeetupDto[]> {
    return await this.meetupService.getAllMeetups(query);
  }

  @ApiResponseAndBody('getMeetupById')
  @Get(':id')
  async getMeetupById(@Param('id') id: number): Promise<MeetupDto> {
    return await this.meetupService.getMeetupById(id);
  }

  @ApiResponseAndBody('createMeetup')
  @Post('create')
  async createMeetup(
    @GetUserId('id') id: number,
    @Body() dto: MeetupDto,
  ): Promise<MeetupDto> {
    return await this.meetupService.createMeetup(id, dto);
  }

  @ApiResponseAndBody('changeMeetup')
  @Patch('change/:id')
  async changeMeetup(
    @GetUserId('id') userId: number,
    @Param('id') id: number,
    @Body() dto: MeetupDto,
  ): Promise<ChangeMeetupDto> {
    return await this.meetupService.changeMeetup(userId, id, dto);
  }

  @ApiResponseAndBody('deleteMeetup')
  @Delete('delete/:id')
  async deleteMeetup(@GetUserId('id') userId: number, @Param('id') id: number) {
    await this.meetupService.deleteMeetup(userId, id);
  }
}
