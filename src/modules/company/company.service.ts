import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from 'common/database/entities/company.entity';
import { ResponseInterface } from 'common/types/interfaces';
import { EntityManager, Repository, UpdateResult } from 'typeorm';

import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
    try {
      const company: Company = this.companyRepo.create(createCompanyDto);
      return await this.entityManager.save(company);
    } catch (error) {
      throw new InternalServerErrorException('Internal server error');
    }
  }

  async getList(): Promise<Company[]> {
    try {
      const companies: Company[] = await this.companyRepo.find();
      return companies;
    } catch (error) {
      throw new InternalServerErrorException('Internal server error');
    }
  }

  async update(id: number, updateCompanyDto: UpdateCompanyDto): Promise<ResponseInterface> {
    try {
      const company: UpdateResult = await this.companyRepo.update(id, updateCompanyDto);

      if (company.affected === 0) throw new NotFoundException('There is no company with this id');

      return { status: 200, message: 'company successfully updated' };
    } catch (error) {
      throw new InternalServerErrorException('Internal server error');
    }
  }
}
