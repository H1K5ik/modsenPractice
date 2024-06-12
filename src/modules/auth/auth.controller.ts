import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from '@decorators/roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: any) {
    return await this.authService.register(dto);
  }

  @Post('login')
  async login(@Body() dto: any, @Res({ passthrough: true }) res: Response) {
    const access_token = await this.authService.login(dto);
    res.cookie('Token', access_token.access_token);
  }

  @UseGuards(JwtAuthGuard)
  @Get('update-tokens')
  update(@Req() req: Request) {
    return this.authService.updateTokens(req.cookies.Token);
  }
}
