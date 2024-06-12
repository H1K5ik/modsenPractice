import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { MeetupService } from './meetup.service';

@Controller('meetup')
export class MeetupController {
  constructor(private readonly meetupService: MeetupService) {}
  @Get()
  async getAllMeetups() {
    return await this.meetupService.getAllMeetups();
  }

  @Get(':id')
  async getMeeupById(@Param('id') id: number) {
    return await this.meetupService.getMeeupById(id);
  }

  @Post('create')
  async ceateMeetup(@Param('id') id: number, @Body() dto: any) {
    return await this.meetupService.createMeetup(id, dto);
  }

  @Patch('change/:id')
  async changeMeetup(@Param('id') id: number, @Body() dto: any) {
    return await this.meetupService.changeMeetup(id, dto);
  }

  @Delete('delete/:id')
  async deleteMeetup(@Param('id') id: number) {
    return await this.meetupService.deleteMeetup(id);
  }
}
