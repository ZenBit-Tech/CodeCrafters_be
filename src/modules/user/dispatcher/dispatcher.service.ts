import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from 'common/database/entities/company.entity';
import { User } from 'common/database/entities/user.entity';
import { Roles } from 'common/enums/enums';
import { ResponseInterface } from 'common/types/interfaces';
import * as jwt from 'jsonwebtoken';
import { EntityManager, Repository } from 'typeorm';

import { CreateDispatcherDto } from './dto/create-dispatcher.dto';
import { UpdateDispatcherDto } from './dto/update-dispatcher.dto';

interface AccessTokenInterface extends jwt.Jwt {
  fullName: string;
  email: string;
  role: Roles;
  company_id: number;
}

@Injectable()
export class DispatcherService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(createDispatcherDto: CreateDispatcherDto, authorization: string): Promise<User> {
    try {
      const company = await this.companyRepo.findOneByOrFail({ id: createDispatcherDto.company_id });

      const decodedToken = <AccessTokenInterface>jwt.decode(authorization);
      if (company.id !== decodedToken.company_id) throw new BadRequestException("You doesn't work in this company");

      const dispatcher = this.userRepo.create({ ...createDispatcherDto, company_id: company });
      return await this.entityManager.save(dispatcher);
    } catch (error) {
      throw new InternalServerErrorException('Internal server error');
    }
  }

  async findOne(id: number, authorization: string): Promise<User> {
    try {
      const dispatcher = await this.userRepo.findOneByOrFail({ id });

      const decodedToken = <AccessTokenInterface>jwt.decode(authorization);
      if (dispatcher.company_id.id !== decodedToken.company_id) throw new BadRequestException("You doesn't work in this company");
      return await this.userRepo.findOneByOrFail({ id });
    } catch (error) {
      throw new BadRequestException('There is no such dispatcher');
    }
  }

  async update(id: number, updateDispatcherDto: UpdateDispatcherDto, authorization: string): Promise<ResponseInterface> {
    try {
      const dispatcher = await this.userRepo.findOneByOrFail({ id });

      const decodedToken = <AccessTokenInterface>jwt.decode(authorization);
      if (dispatcher.company_id.id !== decodedToken.company_id) throw new BadRequestException("You doesn't work in this company");

      await this.userRepo.update(id, { ...updateDispatcherDto });
      return { status: 200, message: `Dispatcher ${dispatcher.full_name} updated successfully` };
    } catch (error) {
      throw new BadRequestException('There is no such dispatcher');
    }
  }

  async remove(id: number, authorization: string): Promise<ResponseInterface> {
    try {
      const dispatcher = await this.userRepo.findOneByOrFail({ id });

      const decodedToken = <AccessTokenInterface>jwt.decode(authorization);
      if (dispatcher.company_id.id !== decodedToken.company_id) throw new BadRequestException("You doesn't work in this company");

      await this.userRepo.delete(id);
      return { status: 200, message: `Dispatcher ${dispatcher.full_name} account deleted successfully` };
    } catch (error) {
      throw new BadRequestException('There is no such dispatcher');
    }
  }
}
