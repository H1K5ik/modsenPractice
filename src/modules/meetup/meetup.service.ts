import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/libs/prisma/prisma/prisma.service';
import { MeetupDto } from './dto/meetup.dto';
import { QueryDto } from './dto/query.dto';

@Injectable()
export class MeetupService {
  constructor(private readonly prisma: PrismaService) {}
  async getAllMeetups(query: QueryDto) {
    try {
      const { title, page = 2, pageSize = 3 } = query;
      const skip = (page - 1) * pageSize;
      const meetups = await this.prisma.meetup.findMany({
        where: { title },
        skip,
        take: +pageSize,
      });
      const total = await this.prisma.meetup.count({ where: { title } });

      return {
        data: meetups,
        total,
        page,
        pageSize,
      };
    } catch (erorr) {
      throw new NotFoundException(`Net takogo meetupa or id not correct`);
    }
  }

  async getMeeupById(id: number) {
    try {
      return await this.prisma.meetup.findUnique({ where: { id: +id } });
    } catch (erorr) {
      throw new NotFoundException(`Net takogo meetupa or id not correct`);
    }
  }

  async createMeetup(id: number, dto: MeetupDto) {
    const meetup = await this.prisma.meetup.create({
      data: {
        title: dto.title,
        description: dto.description,
        tags: dto.tags,
        place: dto.place,
      },
    });

    if (!meetup) throw new BadRequestException('Meetup ne sozdan');

    return meetup;
  }
  async changeMeetup(id: number, dto: MeetupDto) {
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
      throw new NotFoundException(`Net takogo meetupa or data incorrect`);
    }
  }

  async deleteMeetup(id: number) {
    const meetup = await this.prisma.meetup.findUnique({ where: { id: +id } });

    if (!meetup) throw new NotFoundException('Zapisi ne sushestvuet');

    await this.prisma.meetup.delete({ where: { id: +id } });
    return meetup;
  }
}
