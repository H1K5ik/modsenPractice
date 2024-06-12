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
import { AuthDto } from './dto/auth.dto';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiBody({
    type: AuthDto,
    description: 'Json structure for user object',
  })
  @Post('register')
  async register(@Body() dto: AuthDto) {
    return await this.authService.register(dto);
  }

  @ApiResponse({
    status: 201,
    description: 'User loged succesfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiBody({
    type: AuthDto,
    description: 'Json structure for user object',
  })
  @Post('login')
  async login(@Body() dto: AuthDto, @Res({ passthrough: true }) res: Response) {
    const access_token = await this.authService.login(dto);
    res.cookie('Token', access_token.access_token);
  }

  @ApiResponse({
    status: 201,
    description: 'User loged succesfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @UseGuards(JwtAuthGuard)
  @Get('update-tokens')
  update(@Req() req: Request) {
    return this.authService.updateTokens(req.cookies.Token);
  }
}
