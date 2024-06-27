import { Controller, Delete, Param, Post, Query } from '@nestjs/common';

import { ApiResponseAndBody } from '@config/config';
import { GetUserId } from '@decorators/userid.decorator';
import { UserDto } from '@dto';

import { UsersService } from './users.service';

@ApiResponseAndBody('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiResponseAndBody('join')
  @Post(':id/join')
  async joinMeetup(
    @Param('id') id: number,
    @GetUserId('id') userId: number,
  ): Promise<UserDto[]> {
    return this.usersService.addMember(id, userId);
  }

  @ApiResponseAndBody('leave')
  @Delete(':id/leave')
  async leaveMeetup(
    @Param('id') id: number,
    @GetUserId('id') userId: number,
  ): Promise<void> {
    return this.usersService.removeMember(id, userId);
  }

  @ApiResponseAndBody('addParticipant')
  @Post(':id/add-member')
  async addParticipant(
    @Param('id') meetupId: number,
    @GetUserId('id') authorId: number,
    @Query('id') memberId: number,
  ): Promise<UserDto[]> {
    return this.usersService.addParticipant(meetupId, authorId, memberId);
  }

  @ApiResponseAndBody('removeParticipant')
  @Delete(':id/delete-member')
  async removeParticipant(
    @Param('id') meetupId: number,
    @GetUserId('id') authorId: number,
    @Query('id') memberId: number,
  ): Promise<void> {
    return this.usersService.removeParticipant(meetupId, authorId, memberId);
  }
}
