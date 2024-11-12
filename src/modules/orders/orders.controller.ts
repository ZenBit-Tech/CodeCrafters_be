import { Controller, Get, Query } from '@nestjs/common';
import { Order } from 'common/database/entities/order.entity';

import { OrdersService } from './orders.service';
import { OrderQueryParams } from './types';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async findAll(@Query() queryParams: OrderQueryParams): Promise<{ orders: Order[]; page: number; pagesCount: number }> {
    return this.ordersService.findAll(queryParams);
  }
}
