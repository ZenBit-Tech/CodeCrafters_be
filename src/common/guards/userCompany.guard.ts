import { BadRequestException, CanActivate, ExecutionContext } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from 'common/database/entities/company.entity';
import { User } from 'common/database/entities/user.entity';
import { Roles } from 'common/enums/enums';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { Repository } from 'typeorm';

interface AccessTokenInterface extends jwt.Jwt {
  fullName: string;
  email: string;
  role: Roles;
  company_id: Company;
}

export class UserCompanyGuard implements CanActivate {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    if (!request.headers.authorization) throw new Error();
    const decodedToken = <AccessTokenInterface>jwt.decode(request.headers.authorization);

    try {
      if (request.method === 'POST') {
        if (request.body.company_id !== decodedToken.company_id.id) throw new Error();
      } else {
        const user = await this.userRepo.findOneByOrFail({ id: +request.params['id'] });
        if (user.company_id.id !== decodedToken.company_id.id) throw new Error();
      }
      return true;
    } catch (error) {
      throw new BadRequestException("You doesn't work in this company");
    }
  }
}
