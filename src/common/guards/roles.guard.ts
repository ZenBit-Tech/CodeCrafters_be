import { Request } from 'express';
import * as jwt from 'jsonwebtoken';

import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles: string[] = this.reflector.get<string[]>('roles', context.getHandler());
    const request: Request = context.switchToHttp().getRequest();

    if (!request.headers.authorization) {
      throw new UnauthorizedException('Auth token is missing');
    }

    const token = request.headers.authorization.split(' ')[1];
    const jwtSecret = process.env['JWT_SECRET'];

    if (!jwtSecret) {
      throw new UnauthorizedException('JWT secret not configured');
    }

    try {
      const decodedAccessToken = <jwt.JwtPayload>jwt.verify(token, jwtSecret);

      const { role: roleInToken } = decodedAccessToken;

      if (typeof roleInToken !== 'string') {
        throw new UnauthorizedException('Invalid token');
      }

      return requiredRoles.includes(roleInToken);
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
