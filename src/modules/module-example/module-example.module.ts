import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ModuleExampleController } from './module-example.controller';
import { ModuleExampleService } from './module-example.service';
import { Company } from '../../common/entities/company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Company])],
  controllers: [ModuleExampleController],
  providers: [ModuleExampleService],
})
export class ModuleExampleModule {}
