import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from 'common/database/entities/company.entity';
import { User } from 'common/database/entities/user.entity';
import { Roles } from 'common/enums/enums';
import { ResponseInterface } from 'common/types/interfaces';
import { EntityManager, In, Like, Repository } from 'typeorm';

import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';

@Injectable()
export class DriverService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(createDriverDto: CreateDriverDto): Promise<User> {
    try {
      const company = await this.companyRepo.findOneByOrFail({ id: createDriverDto.company_id });

      const dispatcher = this.userRepo.create({ ...createDriverDto, company_id: company });
      return await this.entityManager.save(dispatcher);
    } catch (error) {
      throw new InternalServerErrorException('Internal server error');
    }
  }

  async findAll(sortBy: 'ASC' | 'DESC', search: string, companyId: number): Promise<User[]> {
    try {
      return await this.userRepo.find({
        where: { company_id: { id: companyId }, role: Roles.DRIVER, full_name: Like(`%${search}%`) },
        order: { full_name: sortBy },
      });
    } catch (error) {
      throw new BadRequestException('There is no such dispatcher');
    }
  }

  async findOne(id: number): Promise<User> {
    try {
      return await this.userRepo.findOneByOrFail({ id });
    } catch (error) {
      throw new BadRequestException('There is no such dispatcher');
    }
  }

  async findByListOfId(listOfId: number[]): Promise<User[]> {
    try {
      return await this.userRepo.find({ where: { id: In(listOfId) } });
    } catch (error) {
      throw new InternalServerErrorException('Internal server error');
    }
  }

  async update(id: number, updateDriverDto: UpdateDriverDto): Promise<ResponseInterface> {
    try {
      const dispatcher = await this.userRepo.findOneByOrFail({ id });

      await this.userRepo.update(id, { ...updateDriverDto });
      return { status: 200, message: `Dispatcher ${dispatcher.full_name} updated successfully` };
    } catch (error) {
      throw new BadRequestException('There is no such dispatcher');
    }
  }

  async remove(id: number): Promise<ResponseInterface> {
    try {
      const dispatcher = await this.userRepo.findOneByOrFail({ id });

      await this.userRepo.delete(id);
      return { status: 200, message: `Dispatcher ${dispatcher.full_name} account deleted successfully` };
    } catch (error) {
      throw new BadRequestException('There is no such dispatcher');
    }
  }
}
