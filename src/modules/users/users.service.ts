import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GoogleDriveService } from 'nestjs-googledrive-upload';

import { ImageUserDto, UserDto } from '@libs/dto';
import { PrismaService } from '@libs/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly googleDriveService: GoogleDriveService,
  ) {}

  async uploadImage(
    file: Express.Multer.File,
    userId: number,
  ): Promise<ImageUserDto> {
    if (!file) throw new BadRequestException('Img did not upload');

    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (user.profileImage) throw new BadRequestException('Img already exists');

    const link = await this.googleDriveService.uploadImage(file);

    const img = await this.prisma.user.update({
      where: { id: userId },
      data: { profileImage: link },
      select: {
        id: true,
        email: true,
        name: true,
        profileImage: true,
      },
    });
    return img;
  }

  async getImage(id: number): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) throw new BadRequestException(`Img does not found`);

    return user.profileImage;
  }

  async deleteImage(userId: number): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { profileImage: '' },
    });
  }

  async changeImage(
    userId: number,
    file: Express.Multer.File,
  ): Promise<ImageUserDto> {
    if (!file) throw new BadRequestException('Img did not upload');

    const link = await this.googleDriveService.uploadImage(file);
    const img = await this.prisma.user.update({
      where: { id: userId },
      data: { profileImage: link },
      select: {
        id: true,
        email: true,
        name: true,
        profileImage: true,
      },
    });
    return img;
  }

  async addMember(meetupId: number, userId: number): Promise<UserDto[]> {
    const thisMeetup = await this.prisma.meetup.findFirst({
      where: { id: +meetupId },
      include: { members: true },
    });
    if (!thisMeetup)
      throw new NotFoundException(`The meetup not found or the id is wrong`);

    if (thisMeetup.authorId === userId)
      throw new BadRequestException(`You an author of this meetup`);

    if (thisMeetup.members.find((el) => el.id === userId))
      throw new ForbiddenException(`You're already a member of this meetup`);

    const meetup = await this.prisma.meetup.update({
      where: { id: +meetupId },
      data: {
        members: {
          connect: { id: +userId },
        },
      },
      include: { members: { select: { id: true, email: true, name: true } } },
    });
    return meetup.members;
  }

  async removeMember(meetupId: number, userId: number): Promise<void> {
    const thisMeetup = await this.prisma.meetup.findFirst({
      where: { id: +meetupId },
      include: { members: true },
    });

    if (!thisMeetup)
      throw new NotFoundException(`The meetup not found or the id is wrong`);

    if (thisMeetup.authorId === userId)
      throw new BadRequestException(`You an author of this meetup`);

    if (thisMeetup.members.find((el) => el.id === userId))
      throw new ForbiddenException(`You're already a member of this meetup`);

    await this.prisma.meetup.update({
      where: { id: +meetupId },
      data: {
        members: {
          disconnect: { id: userId },
        },
      },
    });
  }

  async addParticipant(meetupId: number, userId: number, memberId: number) {
    const thisMeetup = await this.prisma.meetup.findFirst({
      where: { id: +meetupId },
      include: { members: true },
    });
    const user = await this.prisma.user.findFirst({
      where: { id: +memberId },
    });
    if (!user)
      throw new NotFoundException(
        `The user not found or the memberId is wrong`,
      );

    if (!thisMeetup)
      throw new NotFoundException(`The meetup not found or the id is wrong`);

    if (!(thisMeetup.authorId == userId))
      throw new BadRequestException(`You're not the author of the meetup`);

    if (!thisMeetup.members.find((el) => el.id === userId))
      throw new ForbiddenException(`You're not member of this meetup`);

    const meetup = await this.prisma.meetup.update({
      where: { id: +meetupId },
      data: {
        members: {
          connect: { id: +userId },
        },
      },
      include: { members: { select: { id: true, email: true, name: true } } },
    });
    return meetup.members;
  }

  async removeParticipant(
    meetupId: number,
    userId: number,
    memberId: number,
  ): Promise<void> {
    const thisMeetup = await this.prisma.meetup.findFirst({
      where: { id: +meetupId },
      include: { members: true },
    });
    const user = await this.prisma.user.findUnique({
      where: { id: +memberId },
    });
    if (!user)
      throw new NotFoundException(
        `The user not found or the memberId is wrong`,
      );

    if (!thisMeetup)
      throw new NotFoundException(`The meetup not found or the id is wrong`);

    if (!(thisMeetup.authorId == userId))
      throw new BadRequestException(`You're not the author of the meetup`);

    if (!thisMeetup.members.find((el) => el.id == memberId))
      throw new ForbiddenException(`User isn't member of this meetup`);

    await this.prisma.meetup.update({
      where: { id: +meetupId },
      data: {
        members: {
          disconnect: { id: +memberId },
        },
      },
    });
  }
}
