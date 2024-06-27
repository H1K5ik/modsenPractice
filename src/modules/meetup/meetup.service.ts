import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GoogleDriveService } from 'nestjs-googledrive-upload';

import { ChangeMeetupDto, MeetupDto } from '@dto';
import { imageProps, queryProps } from '@interfaces';
import { PrismaService } from '@prisma/prisma.service';
import { pagination } from '@utils';

@Injectable()
export class MeetupService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly googleDriveService: GoogleDriveService,
  ) {}

  async uploadImage(file: Express.Multer.File): Promise<imageProps> {
    try {
      if (!file) throw new BadRequestException('Img did not upload');

      const link = await this.googleDriveService.uploadImage(file);
      const id = link.split('id=').at(1);
      await this.prisma.googleImages.create({
        data: { id, images: link },
      });
      const img = await this.prisma.googleImages.findUnique({ where: { id } });
      return img;
    } catch (e) {
      throw new Error(e);
    }
  }

  async getImage(): Promise<imageProps[]> {
    try {
      const img = await this.prisma.googleImages.findMany();

      if (!img) throw new BadRequestException(`Img does not found`);

      return img;
    } catch (e) {
      throw new Error(e);
    }
  }

  // async deleteImage(fileId: string): Promise<void> {
  //   try {
  //     const thisImage = await this.prisma.googleImages.findUnique({
  //       where: { id: fileId },
  //     });

  //     if (!thisImage)
  //       throw new BadRequestException('Wrong img id or img does not exist');

  //     await this.prisma.googleImages.delete({ where: { id: fileId } });
  //     await this.googleDriveService.deleteImage(fileId);
  //   } catch (e) {
  //     throw new Error(e);
  //   }
  // }

  async changeImage(
    fileId: string,
    file: Express.Multer.File,
  ): Promise<imageProps> {
    try {
      const thisImage = await this.prisma.googleImages.findUnique({
        where: { id: fileId },
      });

      if (!thisImage)
        throw new BadRequestException('Wrong img id or img does not exist');

      await this.prisma.googleImages.delete({ where: { id: fileId } });
      await this.googleDriveService.deleteImage(fileId);

      if (!file) throw new BadRequestException('Img did not upload');

      const link = await this.googleDriveService.uploadImage(file);
      const id = link.split('id=').at(1);
      await this.prisma.googleImages.create({
        data: { id, images: link },
      });
      const img = await this.prisma.googleImages.findUnique({ where: { id } });
      return img;
    } catch (e) {
      throw new Error(e);
    }
  }

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
