import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
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

@Injectable()
export class UserCompanyGuard implements CanActivate {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: RequestWithUser = context.switchToHttp().getRequest();
    const { authorization: authorizationHeader } = request.headers;

    if (!authorizationHeader) {
      throw new UnauthorizedException('Authorization token is missing');
    }

    const token = authorizationHeader.split(' ')[1];
    const jwtSecret = process.env['JWT_SECRET'];

    if (!jwtSecret) {
      throw new UnauthorizedException('JWT secret not configured');
    }

    try {
      const decodedToken = <jwt.JwtPayload>jwt.verify(token, jwtSecret);

      const { email } = decodedToken;

      if (typeof email !== 'string') {
        throw new UnauthorizedException('Invalid token payload');
      }

      const user = await this.userRepo.findOneOrFail({
        where: { email },
        relations: ['company_id'],
      });

      request.user = {
        fullName: user.full_name,
        email: user.email,
        role: user.role,
        company_id: user.company_id,
      };

      if (request.method === 'POST') {
        if (request.body.company_id !== user.company_id.id) {
          throw new ForbiddenException('You are not allowed to access this company');
        }
      } else if (request.method === 'GET' && !request.params['id']) {
        return true;
      } else {
        const targetUser = await this.userRepo.findOneOrFail({
          where: { id: +request.params['id'] },
          relations: ['company_id'],
        });
        if (targetUser.company_id.id !== user.company_id.id) {
          throw new ForbiddenException('You are not allowed to access this user');
        }
      }
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
