import { CanActivate, ExecutionContext, UnauthorizedException, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { Observable } from 'rxjs';

interface AuthRequestBody {
  invitationToken: string;
}

@Injectable()
export class InvitationTokenGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<{ body: AuthRequestBody }>();

    if (!request.body.invitationToken) {
      throw new UnauthorizedException('Invitation token is missing in the request body');
    }

    const jwtSecret = process.env['JWT_SECRET'];
    if (!jwtSecret) {
      throw new UnauthorizedException('JWT secret is missing in environment variables');
    }

    try {
      const isTokenValid = jwt.verify(request.body.invitationToken, jwtSecret);
      const decoded = jwt.decode(request.body.invitationToken);

      if (!decoded || typeof decoded === 'string' || !('iat' in decoded) || !('exp' in decoded)) {
        throw new UnauthorizedException('Invalid token structure');
      }

      const decodedToken = <{ isLogginToken: boolean; iat: number; exp: number }>decoded;
      return !!(isTokenValid && decodedToken.isLogginToken);
    } catch (error) {
      throw new UnauthorizedException('Token validation failed');
    }
  }
}
