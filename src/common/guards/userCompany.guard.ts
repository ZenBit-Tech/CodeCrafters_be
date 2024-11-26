import { CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from 'common/database/entities/company.entity';
import { User } from 'common/database/entities/user.entity';
import { Roles } from 'common/enums/enums';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { Repository } from 'typeorm';

export interface AccessTokenInterface {
  fullName: string;
  email: string;
  role: Roles;
  company_id: Company;
}

interface RequestWithUser extends Request {
  user?: AccessTokenInterface;
}

export class UserCompanyGuard implements CanActivate {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: RequestWithUser = context.switchToHttp().getRequest();

    const authorizationHeader = request.headers.authorization;
    if (!authorizationHeader) {
      throw new UnauthorizedException('Authorization token is missing');
    }

    const decodedToken = jwt.decode(authorizationHeader);
    if (typeof decodedToken !== 'object' || decodedToken === null) {
      throw new UnauthorizedException('Invalid token');
    }

    request.user = <AccessTokenInterface>decodedToken;

    try {
      if (request.method === 'POST') {
        if (request.body.company_id !== decodedToken['company_id'].id) {
          throw new ForbiddenException('You are not allowed to access this company');
        }
      } else if (request.method === 'GET' && !request.params['id']) {
        return true;
      } else {
        const user = await this.userRepo.findOneByOrFail({ id: +request.params['id'] });
        if (user.company_id.id !== decodedToken['company_id'].id) {
          throw new ForbiddenException('You are not allowed to access this user');
        }
      }
      return true;
    } catch (error) {
      throw new ForbiddenException('Invalid access rights');
    }
  }
}
