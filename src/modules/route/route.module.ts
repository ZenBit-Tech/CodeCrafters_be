import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from 'common/database/entities/company.entity';
import { Route } from 'common/database/entities/route.entity';
import { User } from 'common/database/entities/user.entity';

import { RouteController } from './route.controller';
import { RouteService } from './route.service';

@Module({
  imports: [TypeOrmModule.forFeature([Route, User, Company])],
  controllers: [RouteController],
  providers: [RouteService],
})
export class RouteModule {}
