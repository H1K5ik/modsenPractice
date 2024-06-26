import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { AuthDto, UserDto } from '@dto';
import { tokenProps } from '@interfaces';
import { PrismaService } from '@prisma/prisma.service';
import { comparePassword, createTokens, hashPassword } from '@utils';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async register(user: AuthDto): Promise<UserDto> {
    if (!user.password) throw new BadRequestException('Write user password');

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
        name: true,
      },
    });
  }

  async login(user: AuthDto): Promise<tokenProps> {
    const thisUser = await this.prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!thisUser) throw new BadRequestException('User does not exist');

    if (!user.password) throw new BadRequestException('Write user password');

    const passwordMatch = comparePassword(user, thisUser);

    if (!passwordMatch) {
      throw new NotFoundException('Incorrect password or login');
    }

    const payload = {
      email: thisUser.email,
      sub: thisUser.id,
      roles: thisUser.roles,
    };

    return createTokens(payload, user.email);
  }

  async updateTokens(token: string): Promise<tokenProps> {
    const user = await this.prisma.user.findFirst({
      where: { Token: token },
    });
    const payload = {
      email: user.email,
      sub: user.id,
      roles: user.roles,
    };
    return createTokens(payload, user.email);
  }

  async googleAuthCallback(user): Promise<tokenProps> {
    const userCompare = await this.prisma.user.findFirst({
      where: { email: user.email },
    });

    if (userCompare) {
      const payload = {
        email: userCompare.email,
        sub: userCompare.id,
        roles: userCompare.roles,
      };
      return createTokens(payload, user.email);
    } else {
      await this.prisma.user.create({
        data: {
          email: user.email,
          name: user.name,
        },
        select: {
          id: true,
          email: true,
          name: true,
        },
      });

      const newUser = await this.prisma.user.findFirst({
        where: { email: user.email },
      });

      const payload = {
        email: newUser.email,
        sub: newUser.id,
        roles: newUser.roles,
      };

      return createTokens(payload, user.email);
    }
  }
}
