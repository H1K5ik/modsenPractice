import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';

import { ApiResponseAndBody } from '@config/config';
import { AuthDto, UserDto } from '@dto';

import { AuthService } from './auth.service';

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
    res.cookie('Token', access_token, { httpOnly: true });
  }

  @ApiResponseAndBody('update-tokens')
  @Get('update-tokens')
  async update(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const access_token = await this.authService.updateTokens(req.cookies.Token);
    res.cookie('Token', access_token, { httpOnly: true });
  }
}
