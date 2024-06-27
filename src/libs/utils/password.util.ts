import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { saltOrRounds } from '@constants';
import { AuthDto } from '@dto';

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, saltOrRounds);
}

export async function comparePassword(
  user: AuthDto,
  thisUser: Prisma.UserGetPayload<null>,
): Promise<boolean> {
  return await bcrypt.compare(user.password, thisUser.password);
}
