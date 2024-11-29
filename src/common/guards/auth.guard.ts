import { Request } from 'express';
import * as jwt from 'jsonwebtoken';

import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();

    const { authorization: accessToken } = request.headers;
    if (!accessToken) throw new BadRequestException('No access token provided');

    try {
      const decodedToken = <jwt.JwtPayload>jwt.verify(accessToken as string, this.configService.getOrThrow('JWT_SECRET'));

      const { role } = decodedToken;

      if (typeof role !== 'string') {
        throw new BadRequestException('Invalid token payload');
      }

      request.headers['role'] = role;

      return true;
    } catch (error) {
      throw new BadRequestException('Invalid or expired token');
    }
  }
}
