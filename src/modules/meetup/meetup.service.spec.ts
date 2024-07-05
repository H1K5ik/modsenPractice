import { ForbiddenException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { MeetupDto } from '@dto';
import { PrismaService } from '@prisma/prisma.service';

import { MeetupService } from './meetup.service';

describe('MeetupService', () => {
  let service: MeetupService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MeetupService,
        {
          provide: PrismaService,
          useValue: {
            meetup: {
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            user: {
              update: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<MeetupService>(MeetupService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should get a meetup by id', async () => {
    const mockMeetup = { id: 1, title: 'Test Meetup' };
    (prismaService.meetup.findUnique as jest.Mock).mockResolvedValue(
      mockMeetup,
    );

    const result = await service.getMeetupById(1);

    expect(result).toEqual(mockMeetup);
    expect(prismaService.meetup.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it('should create a meetup', async () => {
    const mockDto: MeetupDto = {
      title: 'New Meetup',
      description: 'Description',
      tags: 'tag1',
      place: 'Some Place',
      date: new Date(),
    };
    const mockCreatedMeetup = { id: 1, ...mockDto };
    (prismaService.meetup.create as jest.Mock).mockResolvedValue(
      mockCreatedMeetup,
    );

    const result = await service.createMeetup(1, mockDto);

    expect(result).toEqual(mockCreatedMeetup);
    expect(prismaService.meetup.create).toHaveBeenCalled();
    expect(prismaService.user.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { roles: 'Admin' },
    });
  });

  it('should change a meetup', async () => {
    const mockDto: MeetupDto = {
      title: 'Updated Meetup',
      description: 'Updated Description',
      tags: 'tag1',
      place: 'Updated Place',
      date: new Date(),
    };
    const mockOldMeetup = { id: 1, authorId: 1 };
    const mockUpdatedMeetup = { id: 1, ...mockDto };
    (prismaService.meetup.findUnique as jest.Mock).mockResolvedValue(
      mockOldMeetup,
    );
    (prismaService.meetup.update as jest.Mock).mockResolvedValue(
      mockUpdatedMeetup,
    );

    const result = await service.changeMeetup(1, 1, mockDto);

    expect(result).toEqual(mockUpdatedMeetup);
    expect(prismaService.meetup.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(prismaService.meetup.update).toHaveBeenCalled();
  });

  it('should delete a meetup', async () => {
    const mockMeetup = { id: 1, authorId: 1 };
    (prismaService.meetup.findUnique as jest.Mock).mockResolvedValue(
      mockMeetup,
    );

    await service.deleteMeetup(1, 1);

    expect(prismaService.meetup.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(prismaService.meetup.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it('should throw ForbiddenException when trying to change a meetup by non-author', async () => {
    const mockOldMeetup = { id: 1, authorId: 2 };
    (prismaService.meetup.findUnique as jest.Mock).mockResolvedValue(
      mockOldMeetup,
    );

    await expect(service.changeMeetup(1, 1, {} as MeetupDto)).rejects.toThrow(
      ForbiddenException,
    );
  });
});
