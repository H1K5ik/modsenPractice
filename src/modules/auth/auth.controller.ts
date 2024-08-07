import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';

import { ApiResponseAndBody } from '@libs/config';
import { AuthDto, GoogleReqUserDto, UserDto } from '@libs/dto';

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
  async login(
    @Body() dto: AuthDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const tokens = await this.authService.login(dto);
    res.cookie('accessToken', tokens.accessToken, { httpOnly: true });
    res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true });
  }

  @ApiResponseAndBody('update-tokens')
  @Get('update-tokens')
  async update(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const tokens = await this.authService.updateTokens(
      req.cookies.refreshToken,
    );
    res.cookie('accessToken', tokens.accessToken, { httpOnly: true });
    res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true });
  }

  @ApiResponseAndBody('google')
  @Get('google')
  async auth(): Promise<void> {}

  @ApiResponseAndBody('googleAuthCallback')
  @Get('google/callback')
  async googleAuthCallback(
    @Req() req: GoogleReqUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const tokens = await this.authService.googleAuthCallback(req.user);
    res.cookie('accessToken', tokens.accessToken, { httpOnly: true });
    res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true });
  }
}
