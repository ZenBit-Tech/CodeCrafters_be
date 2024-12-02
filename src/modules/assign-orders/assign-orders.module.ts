import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'common/database/entities/order.entity';
import { User } from 'common/database/entities/user.entity';

import { AssignOrdersController } from './assign-orders.controller';
import { AssignOrdersService } from './assign-orders.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Order])],
  controllers: [AssignOrdersController],
  providers: [AssignOrdersService],
})
export class AssignOrdersModule {}
