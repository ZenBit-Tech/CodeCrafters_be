import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from 'common/database/entities/company.entity';
import { User } from 'common/database/entities/user.entity';

import { DispatcherController } from './dispatcher.controller';
import { DispatcherService } from './dispatcher.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Company])],
  controllers: [DispatcherController],
  providers: [DispatcherService],
})
export class DispatcherModule {}
