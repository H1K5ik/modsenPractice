import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/libs/prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import { UserDto } from './dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(user: AuthDto): Promise<UserDto> {
    const hashedPassword = await this.hashPassword(user.password);
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

    const passwordMatch = await bcrypt.compare(
      user.password,
      thisUser.password,
    );

    if (!passwordMatch) {
      throw new NotFoundException('Incorrect password');
    }

    const payload = {
      email: thisUser.email,
      sub: thisUser.id,
      roles: thisUser.roles,
    };
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '999d' });

    await this.prisma.user.update({
      where: { email: user.email },
      data: { Token: refreshToken },
    });

    return this.jwtService.sign(payload, { expiresIn: '1d' });
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
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '999d' });

    await this.prisma.user.update({
      where: { email: user.email },
      data: { Token: refreshToken },
    });
  }

  private async hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }
}
