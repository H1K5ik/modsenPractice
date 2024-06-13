import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MeetupDto, QueryDto } from './dto';
import { PrismaService } from '@prisma/prisma.service';

@Injectable()
export class MeetupService {
  constructor(private readonly prisma: PrismaService) {}
  async getAllMeetups(query: QueryDto): Promise<MeetupDto[]> {
    try {
      const { title, page = 2, pageSize = 3 } = query;
      const skip = (page - 1) * pageSize;
      return await this.prisma.meetup.findMany({
        where: { title },
        skip,
        take: +pageSize,
      });
    } catch (error) {
      throw new NotFoundException(`The meetup not found or the id is wrong`);
    }
  }

  async getMeetupById(id: number): Promise<MeetupDto> {
    try {
      return await this.prisma.meetup.findUnique({ where: { id: +id } });
    } catch (error) {
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
  ): Promise<MeetupDto> {
    const oldPost = await this.prisma.meetup.findUnique({
      where: { id: +id },
    });
    if (!(oldPost.authorId == userId))
      throw new ForbiddenException(`You're not the author of the meetup`);
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
    } catch (error) {
      throw new NotFoundException(`The meetup not found or the id is wrong`);
    }
  }

  async deleteMeetup(userId: number, id: number): Promise<MeetupDto> {
    const meetup = await this.prisma.meetup.findUnique({ where: { id: +id } });

    if (!(meetup.authorId == userId))
      throw new ForbiddenException(`You're not the author of the meetup`);

    if (!meetup)
      throw new NotFoundException(`The meetup not found or the id is wrong`);

    await this.prisma.meetup.delete({ where: { id: +id } });
    return meetup;
  }
}
