import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';

import { AuthDto, PayloadDto } from '@dto';
import { tokenProps } from '@interfaces';

const jwtService = new JwtService();
const prisma = new PrismaClient();
export async function createTokens(
  payload: PayloadDto,
  user: AuthDto,
): Promise<tokenProps> {
  const refreshToken = jwtService.sign(payload, {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_REF_EXP,
  });

  await prisma.user.update({
    where: { email: user.email },
    data: { Token: refreshToken },
  });
  const accessToken = jwtService.sign(payload, {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_AC_EXP,
  });
  return { accessToken, refreshToken };
}
