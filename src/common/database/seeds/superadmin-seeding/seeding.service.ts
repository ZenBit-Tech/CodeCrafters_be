import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Roles } from 'common/enums/enums';
import { DataSource, Repository } from 'typeorm';

import { SuperAdminData } from './data';
import { User } from '../../entities/user.entity';

@Injectable()
export class SeedingService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly dataSource: DataSource,
  ) {}

  async seed() {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const user = await queryRunner.manager.findOne(User, { where: { role: Roles.SUPERADMIN } });

      if (user) return;

      const superAdmin = this.userRepo.create(SuperAdminData);
      await queryRunner.manager.save(superAdmin);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
