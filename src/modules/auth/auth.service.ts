import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/libs/prisma/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(user: any) {
    const hashedPassword = await this.hashPassword(user.password);
    const thisUser = await this.prisma.user.findUnique({
      where: { email: user.email },
    });
    if (thisUser) throw new BadRequestException('User sushestvuet');

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

  async login(user: any) {
    const thisUser = await this.prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!thisUser) throw new BadRequestException('User ne sushestvuet');

    const passwordMatch = await bcrypt.compare(
      user.password,
      thisUser.password,
    );

    if (!passwordMatch) {
      throw new NotFoundException('Не верный пароль!');
    }
    const payload = {
      email: thisUser.email,
      sub: thisUser.id,
      roles: thisUser.roles,
    };
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '15d' });
    await this.prisma.user.update({
      where: { email: user.email },
      data: { Token: refreshToken },
    });
    return { access_token: this.jwtService.sign(payload, { expiresIn: '1d' }) };
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
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '15d' });
    await this.prisma.user.update({
      where: { email: user.email },
      data: { Token: refreshToken },
    });
  }

  private async hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }
}
