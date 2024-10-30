import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles.length) {
      return true;
    }
    const request: Request = context.switchToHttp().getRequest();

    if (!(<{ invitationToken: string }>request.body).invitationToken) {
      throw new UnauthorizedException('Invitation token is missing in the request body');
    }

    return false;
  }
}
