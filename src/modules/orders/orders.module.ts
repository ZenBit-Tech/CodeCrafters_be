import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'common/database/entities/order.entity';
import { User } from 'common/database/entities/user.entity';
import { Company } from 'common/database/entities/company.entity';

import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order, User, Company])],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
