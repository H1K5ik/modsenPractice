import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { ChangeMeetupDto, MeetupDto } from '@libs/dto';
import { queryProps } from '@libs/interfaces';
import { PrismaService } from '@libs/prisma/prisma.service';
import { pagination } from '@libs/utils';

@Injectable()
export class MeetupService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllMeetups(query: queryProps): Promise<MeetupDto[]> {
    try {
      return pagination(query);
    } catch (error) {
      throw new NotFoundException(`The meetup not found or the id is wrong`);
    }
  }

  async getMeetupById(id: number): Promise<MeetupDto> {
    try {
      const thisMeetup = await this.prisma.meetup.findUnique({
        where: { id: +id },
      });

      if (!thisMeetup)
        throw new NotFoundException(`The meetup not found or the id is wrong`);

      return thisMeetup;
    } catch (error) {
      throw new NotFoundException(`The meetup not found or the id is wrong`);
    }
  }

  async createMeetup(id: number, dto: MeetupDto): Promise<MeetupDto> {
    if (!dto.date) dto.date = new Date(Date.now());

    const meetup = await this.prisma.meetup.create({
      data: {
        title: dto.title,
        description: dto.description,
        tags: dto.tags,
        place: dto.place,
        authorId: id,
        date: new Date(dto.date),
      },
    });

    if (!meetup) throw new BadRequestException('Meetup has not been created');

    await this.prisma.user.update({
      where: { id: id },
      data: { roles: 'Admin' },
    });

    return meetup;
  }

  async changeMeetup(
    userId: number,
    id: number,
    dto: MeetupDto,
  ): Promise<ChangeMeetupDto> {
    if (+id !== +id) throw new BadRequestException(`Input correct id`);

    const oldPost = await this.prisma.meetup.findUnique({
      where: { id: +id },
    });

    if (!oldPost)
      throw new BadRequestException("Write correct id or meetup doesn't exist");

    if (!(oldPost.authorId == userId))
      throw new ForbiddenException(`You're not the author of the meetup`);

    try {
      if (!dto.date) dto.date = new Date(Date.now());

      return await this.prisma.meetup.update({
        where: { id: +id },
        data: {
          title: dto.title,
          description: dto.description,
          tags: dto.tags,
          place: dto.place,
          date: new Date(dto.date),
        },
      });
    } catch (error) {
      throw new NotFoundException(`The meetup not found or the id is wrong`);
    }
  }

  async deleteMeetup(userId: number, id: number) {
    const meetup = await this.prisma.meetup.findUnique({ where: { id: +id } });

    if (!meetup)
      throw new NotFoundException(`The meetup not found or the id is wrong`);

    if (!(meetup.authorId == userId))
      throw new ForbiddenException(`You're not the author of the meetup`);

    await this.prisma.meetup.delete({ where: { id: +id } });
  }
}
