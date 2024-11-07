import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from 'common/database/entities/company.entity';
import { User } from 'common/database/entities/user.entity';
import { Roles } from 'common/enums/enums';
import { createUserInvitationMail } from 'common/helpers/createEmailTemplates';
import { MailerService } from 'common/mailer/mailer.service';
import { ResponseInterface } from 'common/types/interfaces';
import * as jwt from 'jsonwebtoken';
import { EntityManager, Repository } from 'typeorm';

import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,
    private readonly entityManager: EntityManager,
    private readonly smtpService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async create(createAdminData: CreateAdminDto): Promise<ResponseInterface> {
    try {
      if (createAdminData.role !== Roles.ADMIN) throw new BadRequestException('User should have admin role');

      const company: Company | null = await this.companyRepo.findOneOrFail({ where: { id: createAdminData.company_id } });

      const admin = this.userRepo.create({ ...createAdminData, company_id: company });

      await this.entityManager.save(admin);

      const invitationToken: string = jwt.sign({ ...admin }, this.configService.getOrThrow('JWT_SECRET'));

      await this.smtpService.sendEmail({
        from: { name: this.configService.getOrThrow('APP_NAME'), address: this.configService.getOrThrow('DEFAULT_EMAIL_FROM') },
        recipients: [{ name: createAdminData.full_name, address: createAdminData.email }],
        subject: 'Invitation Link',
        html: createUserInvitationMail({ companyName: company.name, username: createAdminData.full_name, token: invitationToken }),
        placeholderReplacements: {},
      });

      return { status: 201, message: 'User created successfully' };
    } catch (error) {
      return { status: 500, error };
    }
  }

  async getAll(): Promise<User[] | ResponseInterface> {
    try {
      return await this.userRepo.find({ where: { role: Roles.ADMIN } });
    } catch (error) {
      return { status: 500, error: new InternalServerErrorException() };
    }
  }

  async update(id: number, updateAdmindata: UpdateAdminDto): Promise<ResponseInterface> {
    try {
      const updatedAdmin = await this.userRepo.update(+id, updateAdmindata);

      if (updatedAdmin.affected === 0) throw new BadRequestException('There is no such user');

      return { status: 200, message: 'Admin updated successfully' };
    } catch (error: unknown) {
      return { status: 500, error };
    }
  }

  async remove(id: number): Promise<ResponseInterface> {
    try {
      const deletedAdmin = await this.userRepo.delete(id);

      if (deletedAdmin.affected === 0) throw new BadRequestException('There is no user with this params');

      return { status: 200, message: 'Admin deleted successfully' };
    } catch (error) {
      return { status: 500, error };
    }
  }
}
