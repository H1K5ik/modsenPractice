import { BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import { MeetupDto } from '@dto';
import { queryProps } from '@interfaces';

const prisma = new PrismaClient();
export async function pagination(query: queryProps): Promise<MeetupDto[]> {
  const { field, fieldSearch, page = 1, pageSize } = query;

  if (!pageSize)
    return prisma.meetup.findMany({ where: { [field]: fieldSearch } });

  if (field === 'id') throw new BadRequestException(`We can't search by id`);

  const skip = (page - 1) * pageSize;
  return await prisma.meetup.findMany({
    where: { [field]: fieldSearch },
    skip,
    take: +pageSize,
  });
}
