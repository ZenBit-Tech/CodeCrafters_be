import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from 'common/database/entities/company.entity';
import { Route } from 'common/database/entities/route.entity';
import { User } from 'common/database/entities/user.entity';

import { RoutesController } from './routes.controller';
import { RoutesService } from './routes.service';

@Module({
  imports: [TypeOrmModule.forFeature([Route, Company, User])],
  controllers: [RoutesController],
  providers: [RoutesService],
})
export class RoutesModule {}
