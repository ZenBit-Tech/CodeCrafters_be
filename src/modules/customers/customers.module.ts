import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerSign } from 'common/database/entities/customer-sign.entity';
import { Customer } from 'common/database/entities/customer.entity';
import { Order } from 'common/database/entities/order.entity';

import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';

@Module({
  imports: [TypeOrmModule.forFeature([Customer, Order, CustomerSign])],
  controllers: [CustomersController],
  providers: [CustomersService],
})
export class CustomersModule {}
