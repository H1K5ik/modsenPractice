import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { UserDto } from '@dto';
import { PrismaService } from '@prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

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
