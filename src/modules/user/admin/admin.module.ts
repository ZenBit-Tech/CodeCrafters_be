import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from 'common/database/entities/company.entity';
import { User } from 'common/database/entities/user.entity';

import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Company])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
