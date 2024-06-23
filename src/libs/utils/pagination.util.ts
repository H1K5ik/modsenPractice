import { PrismaClient } from '@prisma/client';

import { MeetupDto } from '@dto';
import { queryProps } from '@interfaces';

const prisma = new PrismaClient();
export async function pagination(query: queryProps): Promise<MeetupDto[]> {
  const { title, page, pageSize } = query;

  if (!pageSize) return prisma.meetup.findMany({ where: { title } });

  const skip = (page - 1) * pageSize;
  return await prisma.meetup.findMany({
    where: { title },
    skip,
    take: +pageSize,
  });
}
