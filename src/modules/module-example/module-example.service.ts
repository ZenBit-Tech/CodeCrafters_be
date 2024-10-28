import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Error } from 'common/types/interfaces';
import { DeleteResult, EntityManager, Repository } from 'typeorm';

import { CreateModuleExampleDto } from './dto/create-module-example.dto';
import { UpdateModuleExampleDto } from './dto/update-module-example.dto';
import { Company } from '../../common/database/entities/company.entity';

@Injectable()
export class ModuleExampleService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(createModuleExampleDto: CreateModuleExampleDto): Promise<Company | Error> {
    try {
      const company = new Company(createModuleExampleDto);

      await this.entityManager.save(company);

      return company;
    } catch (error: unknown) {
      new Logger().error(error);
      return {
        statusCode: 404,
        error: 'Bad request',
        messagages: ['Something went wrong'],
      };
    }
  }

  async findAll(): Promise<Company[] | Error> {
    try {
      const companies: Company[] = await this.companyRepo.find();

      return companies;
    } catch (error) {
      new Logger().error(error);
      return {
        statusCode: 404,
        error: 'Bad request',
        messagages: ['Something went wrong'],
      };
    }
  }

  async findOne(id: number): Promise<Company | Error> {
    try {
      return await this.companyRepo.findOneOrFail({ where: { id } });
    } catch (error) {
      return {
        statusCode: 404,
        error: 'Bad request',
        messagages: ['Something went wrong'],
      };
    }
  }

  async update(id: number, updateModuleExampleDto: UpdateModuleExampleDto): Promise<Company | Error> {
    try {
      const company = await this.companyRepo.findOneOrFail({ where: { id } });

      company.name = updateModuleExampleDto.name;
      company.logo = updateModuleExampleDto.logo;
      company.email = updateModuleExampleDto.email;

      await this.entityManager.save(company);

      return company;
    } catch (error) {
      new Logger().error(error);
      return {
        statusCode: 404,
        error: 'Bad request',
        messagages: ['Something went wrong'],
      };
    }
  }

  async remove(id: number): Promise<DeleteResult | Error> {
    try {
      return await this.companyRepo.delete(id);
    } catch (error) {
      return {
        statusCode: 404,
        error: 'Bad request',
        messagages: ['Something went wrong'],
      };
    }
  }
}
