import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/libs/prisma/prisma.service';
import { MeetupDto } from './dto/meetup.dto';
import { QueryDto } from './dto/query.dto';

@Injectable()
export class MeetupService {
  constructor(private readonly prisma: PrismaService) {}
  async getAllMeetups(query: QueryDto): Promise<MeetupDto[]> {
    try {
      const { title, page = 2, pageSize = 3 } = query;
      const skip = (page - 1) * pageSize;
      const meetups = await this.prisma.meetup.findMany({
        where: { title },
        skip,
        take: +pageSize,
      });
      return meetups;
    } catch (erorr) {
      throw new NotFoundException(`The meetup not found or the id is wrong`);
    }
  }

  async getMeeupById(id: number): Promise<MeetupDto> {
    try {
      return await this.prisma.meetup.findUnique({ where: { id: +id } });
    } catch (erorr) {
      throw new NotFoundException(`The meetup not found or the id is wrong`);
    }
  }

  async createMeetup(id: number, dto: MeetupDto): Promise<MeetupDto> {
    const meetup = await this.prisma.meetup.create({
      data: {
        title: dto.title,
        description: dto.description,
        tags: dto.tags,
        place: dto.place,
        authorId: id,
        date: dto.date,
      },
    });

    if (!meetup) throw new BadRequestException('Meetap has not been created');
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
  ): Promise<MeetupDto> {
    const oldPost = await this.prisma.meetup.findUnique({
      where: { id: id },
    });
    if (!(oldPost.authorId == userId))
      throw new ForbiddenException(`You're not the author of the meetap`);
    try {
      return await this.prisma.meetup.update({
        where: { id: +id },
        data: {
          title: dto.title,
          description: dto.description,
          tags: dto.tags,
          place: dto.place,
        },
      });
    } catch (erorr) {
      throw new NotFoundException(`The meetup not found or the id is wrong`);
    }
  }

  async deleteMeetup(userId: number, id: number): Promise<MeetupDto> {
    const meetup = await this.prisma.meetup.findUnique({ where: { id: +id } });

    if (!(meetup.authorId == userId))
      throw new ForbiddenException(`You're not the author of the meetap`);

    if (!meetup)
      throw new NotFoundException(`The meetup not found or the id is wrong`);

    await this.prisma.meetup.delete({ where: { id: +id } });
    return meetup;
  }
}
