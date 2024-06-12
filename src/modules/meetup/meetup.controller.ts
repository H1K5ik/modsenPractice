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
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('meetup')
@Controller('meetup')
export class MeetupController {
  constructor(private readonly meetupService: MeetupService) {}
  @ApiResponse({
    status: 200,
    description: 'Meetups found',
  })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @Get()
  async getAllMeetups(@Query() query: QueryDto) {
    return await this.meetupService.getAllMeetups(query);
  }

  @ApiResponse({
    status: 200,
    description: 'Meetup found',
  })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @Get(':id')
  async getMeeupById(@Param('id') id: number) {
    return await this.meetupService.getMeeupById(id);
  }

  @ApiResponse({
    status: 201,
    description: 'Created',
  })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @Post('create')
  async ceateMeetup(@Param('id') id: number, @Body() dto: MeetupDto) {
    return await this.meetupService.createMeetup(id, dto);
  }

  @ApiResponse({
    status: 200,
    description: 'Changed',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @Patch('change/:id')
  async changeMeetup(@Param('id') id: number, @Body() dto: MeetupDto) {
    return await this.meetupService.changeMeetup(id, dto);
  }
  @ApiResponse({
    status: 200,
    description: 'Deleted',
  })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @Delete('delete/:id')
  async deleteMeetup(@Param('id') id: number) {
    return await this.meetupService.deleteMeetup(id);
  }
}
