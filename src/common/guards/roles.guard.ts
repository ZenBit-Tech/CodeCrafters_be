import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles: string[] = this.reflector.get<string[]>('roles', context.getHandler());
    const request: Request = context.switchToHttp().getRequest();

    if (!request.headers.authorization) {
      throw new UnauthorizedException('Auth token is missing in the request headers');
    }

    const token = request.headers.authorization.split(' ')[request.headers.authorization.split(' ').length - 1];

    try {
      jwt.verify(token, this.configService.getOrThrow('JWT_SECRET'));
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedException('Auth token has expired');
      }
      throw new UnauthorizedException('Auth token is invalid');
    }

    const decodedAccessToken = <{ role: string }>jwt.decode(token);

    if (decodedAccessToken.role) {
      return requiredRoles.some((role: string) => role === decodedAccessToken.role);
    }

    throw new UnauthorizedException('Auth token is invalid');
  }
}
