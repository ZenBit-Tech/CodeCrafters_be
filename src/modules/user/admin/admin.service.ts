import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from 'common/database/entities/company.entity';
import { User } from 'common/database/entities/user.entity';
import { Roles } from 'common/enums/enums';
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
  ) {}

  async create(createAdminData: CreateAdminDto): Promise<{ status: number; message?: string; error?: unknown }> {
    try {
      if (createAdminData.role !== Roles.ADMIN) throw new BadRequestException('User should have admin role');

      const company: Company | null = await this.companyRepo.findOneOrFail({ where: { id: createAdminData.company_id } });

      const admin = this.userRepo.create({ ...createAdminData, company_id: company });
      await this.entityManager.save(admin);

      return { status: 201, message: 'User created successfully' };
    } catch (error) {
      return { status: 500, error };
    }
  }

  async update(id: number, updateAdmindata: UpdateAdminDto): Promise<{ status: number; message?: string; error?: unknown }> {
    try {
      const updatedAdmin = await this.userRepo.update(+id, updateAdmindata);

      if (updatedAdmin.affected === 0) throw new BadRequestException('There is no such user');

      return { status: 200, message: 'Admin updated successfully' };
    } catch (error: unknown) {
      return { status: 500, error };
    }
  }

  async remove(id: number): Promise<{ status: number; message?: string; error?: unknown }> {
    try {
      const deletedAdmin = await this.userRepo.delete(id);

      if (deletedAdmin.affected === 0) throw new BadRequestException('There is no user with this params');

      return { status: 200, message: 'Admin deleted successfully' };
    } catch (error) {
      return { status: 500, error };
    }
  }
}
