import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from 'common/database/entities/company.entity';

import { ModuleExampleController } from './module-example.controller';
import { ModuleExampleService } from './module-example.service';

@Module({
  imports: [TypeOrmModule.forFeature([Company])],
  controllers: [ModuleExampleController],
  providers: [ModuleExampleService],
})
export class ModuleExampleModule {}
