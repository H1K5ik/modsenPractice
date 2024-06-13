import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { AuthDto } from './dto/auth.dto';
import { ApiTags } from '@nestjs/swagger';
import { UserDto } from './dto/user.dto';
import { ApiResponseAndBody } from '../../libs/config/config';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponseAndBody('register')
  @Post('register')
  async register(@Body() dto: AuthDto): Promise<UserDto> {
    return await this.authService.register(dto);
  }

  @ApiResponseAndBody('login')
  @Post('login')
  async login(@Body() dto: AuthDto, @Res({ passthrough: true }) res: Response) {
    const access_token = await this.authService.login(dto);
    res.cookie('Token', access_token);
  }

  @ApiResponseAndBody('update-tokens')
  @Get('update-tokens')
  update(@Req() req: Request) {
    return this.authService.updateTokens(req.cookies.Token);
  }
}
