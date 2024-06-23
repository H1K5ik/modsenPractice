import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AuthDto, UserDto } from '@dto';
import { PrismaService } from '@prisma/prisma.service';
import { comparePassword, hashPassword, createTokens } from '@utils';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(user: AuthDto): Promise<UserDto> {
    const hashedPassword = await hashPassword(user.password);
    const thisUser = await this.prisma.user.findUnique({
      where: { email: user.email },
    });

    if (thisUser) throw new BadRequestException('User exists');

    const userName = user.email.split('@')[0];
    return await this.prisma.user.create({
      data: {
        email: user.email,
        password: hashedPassword,
        name: userName,
      },
      select: {
        id: true,
        email: true,
        roles: true,
      },
    });
  }

  async login(user: AuthDto): Promise<string> {
    const thisUser = await this.prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!thisUser) throw new BadRequestException('User does not exist');

    const passwordMatch = comparePassword(user, thisUser);

    if (!passwordMatch) {
      throw new NotFoundException('Incorrect password or login');
    }

    const payload = {
      email: thisUser.email,
      sub: thisUser.id,
      roles: thisUser.roles,
    };

    return createTokens(payload, user);
  }

  async updateTokens(token: string) {
    const decodedToken = await this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET,
    });
    const user = await this.prisma.user.findUnique({
      where: { email: decodedToken.email },
    });
    const payload = {
      email: user.email,
      sub: user.id,
      roles: user.roles,
    };
    return createTokens(payload, user);
  }
}
