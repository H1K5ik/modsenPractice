import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { ApiResponseAndBody } from '@libs/config';
import { GetUserId } from '@libs/decorators';
import { ImageUserDto, UserDto } from '@libs/dto';

import { UsersService } from './users.service';

@ApiResponseAndBody('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiResponseAndBody('upload')
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @GetUserId('id') userId: number,
  ): Promise<ImageUserDto> {
    return await this.usersService.uploadImage(file, userId);
  }

  @ApiResponseAndBody('getImage')
  @Get('get-image')
  async getImage(@GetUserId('id') userId: number): Promise<string> {
    return await this.usersService.getImage(userId);
  }

  @ApiResponseAndBody('deleteImage')
  @Delete('delete-image')
  async deleteImage(@GetUserId('id') userId: number): Promise<void> {
    return await this.usersService.deleteImage(userId);
  }

  @ApiResponseAndBody('changeImage')
  @Put('change-image')
  @UseInterceptors(FileInterceptor('file'))
  async changeImage(
    @GetUserId('id') userId: number,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ImageUserDto> {
    return await this.usersService.changeImage(userId, file);
  }
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
