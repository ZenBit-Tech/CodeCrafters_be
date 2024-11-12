import { Controller, Get } from '@nestjs/common';
import { Order } from 'common/database/entities/order.entity';

import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async findAll(): Promise<Order[]> {
    return this.ordersService.findAll();
  }
}
