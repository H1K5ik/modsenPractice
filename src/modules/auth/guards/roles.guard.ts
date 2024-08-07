import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';

import { ROLES_KEY } from '@libs/decorators';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const user = context.switchToHttp().getRequest();
    const access_token = user.cookies.accessToken;

    try {
      const decodedToken = this.jwtService.verify(access_token, {
        secret: process.env.JWT_SECRET,
      });
      const { roles } = decodedToken;
      return requiredRoles.some((role) => roles?.includes(role));
    } catch (error) {
      return false;
    }
  }
}
