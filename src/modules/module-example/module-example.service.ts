import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, EntityManager, Repository } from 'typeorm';

import { CreateModuleExampleDto } from './dto/create-module-example.dto';
import { UpdateModuleExampleDto } from './dto/update-module-example.dto';
import { Company } from '../../common/database/entities/company.entity';
import { IError } from 'common/types/interfaces';

@Injectable()
export class ModuleExampleService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(createModuleExampleDto: CreateModuleExampleDto): Promise<Company | IError> {
    try {
      const company = new Company(createModuleExampleDto);

      await this.entityManager.save(company);

      return company;
    } catch (error: unknown) {
      new Logger().error(error);
      return {
        statusCode: 404,
        error: 'Bad request',
        messagages: [`${error}`],
      };
    }
  }

  async findAll(): Promise<Company[] | IError> {
    try {
      const companies: Company[] = await this.companyRepo.find();

      return companies;
    } catch (error) {
      new Logger().error(error);
      return {
        statusCode: 404,
        error: 'Bad request',
        messagages: [`${error}`],
      };
    }
  }

  async findOne(id: number): Promise<Company | IError> {
    try {
      return await this.companyRepo.findOneOrFail({ where: { id } });
    } catch (error) {
      return {
        statusCode: 404,
        error: 'Bad request',
        messagages: [`${error}`],
      };
    }
  }

  async update(id: number, updateModuleExampleDto: UpdateModuleExampleDto): Promise<Company | IError> {
    try {
      const company = await this.companyRepo.findOneOrFail({ where: { id } });

      company.name = updateModuleExampleDto.name;
      company.logo = updateModuleExampleDto.logo;

      await this.entityManager.save(company);

      return company;
    } catch (error) {
      new Logger().error(error);
      return {
        statusCode: 404,
        error: 'Bad request',
        messagages: [`${error}`],
      };
    }
  }

  async remove(id: number): Promise<DeleteResult | IError> {
    try {
      return await this.companyRepo.delete(id);
    } catch (error) {
      return {
        statusCode: 404,
        error: 'Bad request',
        messagages: [`${error}`],
      };
    }
  }
}
