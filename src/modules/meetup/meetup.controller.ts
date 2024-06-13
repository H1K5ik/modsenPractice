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
import { GetUserId } from 'src/libs/decorators/userid.decorator';
import { ApiResponseAndBody } from '../../libs/config/config';

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
    return await this.meetupService.getMeeupById(id);
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
  ): Promise<MeetupDto> {
    return await this.meetupService.changeMeetup(userId, id, dto);
  }

  @ApiResponseAndBody('deleteMeetup')
  @Delete('delete/:id')
  async deleteMeetup(
    @GetUserId('id') userId: number,
    @Param('id') id: number,
  ): Promise<MeetupDto> {
    return await this.meetupService.deleteMeetup(userId, id);
  }
}
