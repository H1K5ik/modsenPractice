import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { ROLES_KEY } from '@decorators/roles.decorator';

@Injectable()
export class RolesStrategy implements CanActivate {
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
    const access_token = user.cookies.Token;

    try {
      const decodedToken = this.jwtService.verify(access_token, {
        secret: process.env.JWT_SECRET,
      });
      const roles = decodedToken.roles;

      return requiredRoles.some((role) => roles?.includes(role));
    } catch (error) {
      return false;
    }
  }
}
