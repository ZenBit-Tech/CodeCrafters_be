import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { Customer } from 'common/database/entities/customer.entity';

import { CustomersService } from './customers.service';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get('/boarding-pass-verify/:id')
  async verifyTicket(@Param('id', ParseIntPipe) id: number, @Query('orderId', ParseIntPipe) orderId: number): Promise<boolean> {
    return this.customersService.verifyTicket(id, orderId);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Customer> {
    return this.customersService.findOne(id);
  }
}
