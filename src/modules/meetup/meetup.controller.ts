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
import { MeetupService } from './meetup.service';
import { MeetupDto } from './dto/meetup.dto';
import { QueryDto } from './dto/query.dto';

@Controller('meetup')
export class MeetupController {
  constructor(private readonly meetupService: MeetupService) {}
  @Get()
  async getAllMeetups(@Query() query: QueryDto) {
    return await this.meetupService.getAllMeetups(query);
  }

  @Get(':id')
  async getMeeupById(@Param('id') id: number) {
    return await this.meetupService.getMeeupById(id);
  }

  @Post('create')
  async ceateMeetup(@Param('id') id: number, @Body() dto: MeetupDto) {
    return await this.meetupService.createMeetup(id, dto);
  }

  @Patch('change/:id')
  async changeMeetup(@Param('id') id: number, @Body() dto: MeetupDto) {
    return await this.meetupService.changeMeetup(id, dto);
  }

  @Delete('delete/:id')
  async deleteMeetup(@Param('id') id: number) {
    return await this.meetupService.deleteMeetup(id);
  }
}
