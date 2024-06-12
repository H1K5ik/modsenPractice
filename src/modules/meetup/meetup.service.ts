import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { NotFoundError } from 'rxjs';
import { PrismaService } from 'src/libs/prisma/prisma/prisma.service';

@Injectable()
export class MeetupService {
  constructor(private readonly prisma: PrismaService) {}
  async getAllMeetups() {
    return this.prisma.meetup.findMany();
  }
  async getMeeupById(id: number) {
    try {
      return await this.prisma.meetup.findUnique({ where: { id: +id } });
    } catch (erorr) {
      throw new NotFoundException(`Net takogo meetupa or id not correct`);
    }
  }
  async createMeetup(id: number, dto: any) {
    const meetup = await this.prisma.meetup.create({
      data: {
        title: dto.title,
        authorId: id,
        description: dto.description,
        tags: dto.tags,
      },
    });

    if (!meetup) throw new BadRequestException('Meetup ne sozdan');

    return meetup;
  }
  async changeMeetup(id: number, dto: any) {
    try {
      return await this.prisma.meetup.update({
        where: { id: +id },
        data: {
          title: dto.title,
          description: dto.description,
          tags: dto.tags,
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
