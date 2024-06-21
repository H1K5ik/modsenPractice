import { AuthDto, PayloadDto } from '@dto';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';

const jwtService = new JwtService();
const prisma = new PrismaClient();
export async function createTokens(
  payload: PayloadDto,
  user: AuthDto,
): Promise<string> {
  const refreshToken = jwtService.sign(payload, {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_REF_EXP,
  });

  await prisma.user.update({
    where: { email: user.email },
    data: { Token: refreshToken },
  });

  return jwtService.sign(payload, {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_AC_EXP,
  });
}
