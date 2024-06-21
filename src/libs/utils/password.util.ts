import { AuthDto } from '@dto';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export async function hashPassword(password: string): Promise<string> {
  const salt = 10;
  return await bcrypt.hash(password, salt);
}

export async function comparePassword(
  user: AuthDto,
  thisUser: Prisma.UserGetPayload<null>,
): Promise<boolean> {
  return await bcrypt.compare(user.password, thisUser.password);
}
