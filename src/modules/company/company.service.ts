import { Company } from 'common/database/entities/company.entity';
import { createCompanyInvitationMail } from 'common/helpers/createEmailTemplates';
import { MailerService } from 'common/mailer/mailer.service';
import { ResponseInterface } from 'common/types/interfaces';
import { EntityManager, Repository, UpdateResult } from 'typeorm';

import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,
    private readonly entityManager: EntityManager,
    private readonly smtpService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
    try {
      const company: Company = this.companyRepo.create(createCompanyDto);

      await this.smtpService.sendEmail({
        from: { name: this.configService.getOrThrow('APP_NAME'), address: this.configService.getOrThrow('DEFAULT_EMAIL_FROM') },
        recipients: [{ name: createCompanyDto.name, address: createCompanyDto.email }],
        subject: 'Invitation Link',
        html: createCompanyInvitationMail(createCompanyDto.name),
        placeholderReplacements: {},
      });

      return await this.entityManager.save(company);
    } catch (error) {
      throw new InternalServerErrorException('Internal server error');
    }
  }

  async getList(
    page: number = 1,
    pageSize: number = 10,
    searchTerm?: string,
    sortBy: string = 'name',
    sortOrder: 'ASC' | 'DESC' = 'ASC',
  ): Promise<{ data: Company[]; total: number }> {
    try {
      const query = this.companyRepo.createQueryBuilder('company');

      if (searchTerm) {
        query.where('company.name LIKE :searchTerm', {
          searchTerm: `%${searchTerm}%`,
        });
      }

      query.orderBy(`company.${sortBy}`, sortOrder);

      query.skip((page - 1) * pageSize).take(pageSize);

      const [data, total] = await query.getManyAndCount();
      return { data, total };
    } catch (error) {
      throw new InternalServerErrorException('Failed to get company list');
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
