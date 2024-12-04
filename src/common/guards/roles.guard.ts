import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles: string[] = this.reflector.get<string[]>('roles', context.getHandler());
    const request: Request = context.switchToHttp().getRequest();

    if (!request.headers.authorization) {
      throw new UnauthorizedException('Auth token is missing in the request headers');
    }

    const decodedAccessToken = <{ role: string }>(
      jwt.decode(request.headers.authorization.split(' ')[request.headers.authorization.split(' ').length - 1])
    );

    if (decodedAccessToken.role) {
      return requiredRoles.some((role: string) => role === decodedAccessToken.role);
    }

    throw new UnauthorizedException('Auth token is invalid');
  }
}
