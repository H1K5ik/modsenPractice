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
import { ChangeMeetupDto, MeetupDto, UserDto } from '@dto';
import { queryProps } from '@interfaces';

import { MeetupService } from './meetup.service';

@ApiResponseAndBody('meetup')
@Controller('meetup')
export class MeetupController {
  constructor(private readonly meetupService: MeetupService) {}

  @ApiResponseAndBody('join')
  @Post(':id/join')
  async joinMeetup(
    @Param('id') id: number,
    @GetUserId('id') userId: number,
  ): Promise<UserDto[]> {
    return this.meetupService.addMember(id, userId);
  }

  @ApiResponseAndBody('leave')
  @Delete(':id/leave')
  async leaveMeetup(
    @Param('id') id: number,
    @GetUserId('id') userId: number,
  ): Promise<void> {
    return this.meetupService.removeMember(id, userId);
  }

  @ApiResponseAndBody('addParticipant')
  @Post(':id/add-member')
  async addParticipant(
    @Param('id') meetupId: number,
    @GetUserId('id') authorId: number,
    @Query('id') memberId: number,
  ): Promise<UserDto[]> {
    return this.meetupService.addParticipant(meetupId, authorId, memberId);
  }

  @ApiResponseAndBody('removeParticipant')
  @Delete(':id/delete-member')
  async removeParticipant(
    @Param('id') meetupId: number,
    @GetUserId('id') authorId: number,
    @Query('id') memberId: number,
  ): Promise<void> {
    return this.meetupService.removeParticipant(meetupId, authorId, memberId);
  }

  @ApiResponseAndBody('getAllMeetups')
  @Get()
  async getAllMeetups(@Query() query: queryProps): Promise<MeetupDto[]> {
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
