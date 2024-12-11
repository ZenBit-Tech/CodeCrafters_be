import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from 'common/database/entities/company.entity';
import { Order } from 'common/database/entities/order.entity';
import { Route } from 'common/database/entities/route.entity';
import { User } from 'common/database/entities/user.entity';
import { MailerService } from 'common/mailer/mailer.service';

import { RouteController } from './route.controller';
import { RouteService } from './route.service';

@Module({
  imports: [TypeOrmModule.forFeature([Route, User, Company, Order])],
  controllers: [RouteController],
  providers: [RouteService, MailerService],
})
export class RouteModule {}
