import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from 'common/database/entities/company.entity';
import { User } from 'common/database/entities/user.entity';

import { DriverController } from './driver.controller';
import { DriverService } from './driver.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Company])],
  controllers: [DriverController],
  providers: [DriverService],
})
export class DriverModule {}
