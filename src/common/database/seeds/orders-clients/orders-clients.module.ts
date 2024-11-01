import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from 'common/database/entities/company.entity';
import { Customer } from 'common/database/entities/customer.entity';

import { OrdersClientsService } from './orders-clients.service';

@Module({
  imports: [TypeOrmModule.forFeature([Company, Customer])],
  providers: [OrdersClientsService],
})
export class OrdersClientsModule {}
