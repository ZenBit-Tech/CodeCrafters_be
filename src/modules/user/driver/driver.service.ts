import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from 'common/database/entities/company.entity';
import { User } from 'common/database/entities/user.entity';
import { Roles } from 'common/enums/enums';
import { ResponseInterface } from 'common/types/interfaces';
import * as jwt from 'jsonwebtoken';
import { EntityManager, Repository } from 'typeorm';

import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';

interface AccessTokenInterface extends jwt.Jwt {
  fullName: string;
  email: string;
  role: Roles;
  company_id: Company;
}

@Injectable()
export class DriverService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(createDriverDto: CreateDriverDto, authorization: string): Promise<User> {
    try {
      const company = await this.companyRepo.findOneByOrFail({ id: createDriverDto.company_id });

      const decodedToken = <AccessTokenInterface>jwt.decode(authorization);
      if (company.id !== decodedToken.company_id.id) throw new BadRequestException("You doesn't work in this company");

      const dispatcher = this.userRepo.create({ ...createDriverDto, company_id: company });
      return await this.entityManager.save(dispatcher);
    } catch (error) {
      throw new InternalServerErrorException('Internal server error');
    }
  }

  async findOne(id: number, authorization: string): Promise<User> {
    try {
      const dispatcher = await this.userRepo.findOneByOrFail({ id });

      const decodedToken = <AccessTokenInterface>jwt.decode(authorization);
      if (dispatcher.company_id.id !== decodedToken.company_id.id) throw new BadRequestException("You doesn't work in this company");
      return await this.userRepo.findOneByOrFail({ id });
    } catch (error) {
      throw new BadRequestException('There is no such dispatcher');
    }
  }

  async update(id: number, updateDriverDto: UpdateDriverDto, authorization: string): Promise<ResponseInterface> {
    try {
      const dispatcher = await this.userRepo.findOneByOrFail({ id });

      const decodedToken = <AccessTokenInterface>jwt.decode(authorization);
      if (dispatcher.company_id.id !== decodedToken.company_id.id) throw new BadRequestException("You doesn't work in this company");

      await this.userRepo.update(id, { ...updateDriverDto });
      return { status: 200, message: `Dispatcher ${dispatcher.full_name} updated successfully` };
    } catch (error) {
      throw new BadRequestException('There is no such dispatcher');
    }
  }

  async remove(id: number, authorization: string): Promise<ResponseInterface> {
    try {
      const dispatcher = await this.userRepo.findOneByOrFail({ id });

      const decodedToken = <AccessTokenInterface>jwt.decode(authorization);
      if (dispatcher.company_id.id !== decodedToken.company_id.id) throw new BadRequestException("You doesn't work in this company");

      await this.userRepo.delete(id);
      return { status: 200, message: `Dispatcher ${dispatcher.full_name} account deleted successfully` };
    } catch (error) {
      throw new BadRequestException('There is no such dispatcher');
    }
  }
}
