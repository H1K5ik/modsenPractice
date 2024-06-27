import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { ApiResponseAndBody } from '@config/config';
import { GetUserId } from '@decorators/userid.decorator';
import { ChangeMeetupDto, MeetupDto } from '@dto';
import { imageProps, queryProps } from '@interfaces';

import { MeetupService } from './meetup.service';

@ApiResponseAndBody('meetup')
@Controller('meetup')
export class MeetupController {
  constructor(private readonly meetupService: MeetupService) {}

  @Get('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<imageProps> {
    return await this.meetupService.uploadImage(file);
  }

  @Get('get-images')
  async getImage(): Promise<imageProps[]> {
    return await this.meetupService.getImage();
  }

  @Delete('delete-image/:id')
  async deleteImage(@Param('id') id: string): Promise<void> {
    return await this.meetupService.deleteImage(id);
  }

  @Put('change-image/:id')
  @UseInterceptors(FileInterceptor('file'))
  async changeImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<imageProps> {
    return await this.meetupService.changeImage(id, file);
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
