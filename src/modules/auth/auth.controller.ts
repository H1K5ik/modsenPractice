import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  
  @Post('registor')
  async register(@Body() dto: any) {
    return await this.authService.register(dto);
  }

  @Post('login')
  async login(@Body() dto: any) {
    return await this.authService.login(dto);
  }

  @Get('update-tokens')
  update(@Req() req: Request) {
    return this.authService.updateTokens(req.cookies.Token);
  }
}
