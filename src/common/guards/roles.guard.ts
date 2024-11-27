import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { Observable } from 'rxjs';

import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

interface JwtPayload {
  role: string;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles: string[] = this.reflector.get<string[]>('roles', context.getHandler());
    const request: Request = context.switchToHttp().getRequest();

    if (!request.headers.authorization) {
      throw new UnauthorizedException('Auth token is missing in the request headers');
    }

    const token = request.headers.authorization.split(' ')[1];
    const jwtSecret = process.env['JWT_SECRET'];

    if (!jwtSecret) {
      throw new UnauthorizedException('JWT secret not configured');
    }

    try {
      const decodedAccessToken = <JwtPayload>jwt.verify(token, jwtSecret);

      if (!decodedAccessToken.role) {
        throw new UnauthorizedException('Invalid token');
      }

      return requiredRoles.some((role: string) => role === decodedAccessToken.role);
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
