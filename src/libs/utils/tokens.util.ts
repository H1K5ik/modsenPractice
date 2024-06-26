import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { saltOrRounds } from '@constants';
import { PayloadDto } from '@dto';
import { tokenProps } from '@interfaces';

const jwtService = new JwtService();
const prisma = new PrismaClient();
export async function createTokens(
  payload: PayloadDto,
  userEmail: string,
): Promise<tokenProps> {
  const refreshToken = jwtService.sign(payload, {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_REF_EXP,
  });
  const hash = await bcrypt.hash(refreshToken, saltOrRounds);
  await prisma.user.update({
    where: { email: userEmail },
    data: { Token: hash },
  });
  const accessToken = jwtService.sign(payload, {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_AC_EXP,
  });
  return { accessToken, refreshToken: hash };
}
