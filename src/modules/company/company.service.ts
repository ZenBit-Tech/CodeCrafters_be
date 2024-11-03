import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from 'common/database/entities/company.entity';
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

  async update(id: number, updateCompanyDto: UpdateCompanyDto): Promise<{ status: number; message: string }> {
    try {
      const company: UpdateResult = await this.companyRepo.update(+id, updateCompanyDto);

      if (company.affected === 0) throw new NotFoundException('There is no company with this id');

      return { status: 200, message: 'company successfully updated' };
    } catch (error) {
      throw new InternalServerErrorException('Internal server error');
    }
  }
}
