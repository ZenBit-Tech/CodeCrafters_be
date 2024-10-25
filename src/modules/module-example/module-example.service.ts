import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { CreateModuleExampleDto } from './dto/create-module-example.dto';
import { UpdateModuleExampleDto } from './dto/update-module-example.dto';
import { Company } from '../../common/entities/company.entity';

@Injectable()
export class ModuleExampleService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(createModuleExampleDto: CreateModuleExampleDto) {
    try {
      const company = new Company(createModuleExampleDto);

      await this.entityManager.save(company);

      return company;
    } catch (error) {
      new Logger().error(error);
      return error;
    }
  }

  async findAll() {
    try {
      const companies: Company[] = await this.companyRepo.find();

      return companies;
    } catch (error) {
      new Logger().error(error);
      return error;
    }
  }

  async findOne(id: number) {
    try {
      return await this.companyRepo.findOneOrFail({ where: { id } });
    } catch (error) {
      return error;
    }
  }

  async update(id: number, updateModuleExampleDto: UpdateModuleExampleDto) {
    try {
      const company = await this.companyRepo.findOneOrFail({ where: { id } });

      company.name = updateModuleExampleDto.name;
      company.logo = updateModuleExampleDto.logo;

      await this.entityManager.save(company);

      return company;
    } catch (error) {
      new Logger().error(error);
      return error;
    }
  }

  async remove(id: number) {
    try {
      return await this.companyRepo.delete(id);
    } catch (error) {
      return error;
    }
  }
}
