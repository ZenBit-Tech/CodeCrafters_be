import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Roles } from 'common/enums/enums';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { Observable } from 'rxjs';

interface AccessToken extends jwt.Jwt {
  role: Roles;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const accessToken = request.headers.authorization;
    if (!accessToken) throw new BadRequestException('there is no accessToken');

    const isTokenValid = jwt.verify(accessToken, this.configService.getOrThrow('JWT_SECRET'));
    if (!isTokenValid) throw new BadRequestException('there is no accessToken or token is invalid');

    const decodedToken = <AccessToken>jwt.decode(accessToken);

    request.headers['role'] = decodedToken.role;

    return true;
  }
}
