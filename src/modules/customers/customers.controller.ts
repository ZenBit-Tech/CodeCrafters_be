import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Customer } from 'common/database/entities/customer.entity';

import { CustomersService } from './customers.service';

@ApiTags('Customers')
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get('/boarding-pass-verify/:id')
  @ApiOperation({ summary: 'Verify a boarding pass' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'The ID of the customer to verify the boarding pass for',
  })
  @ApiQuery({
    name: 'orderId',
    type: Number,
    description: 'The ID of the order associated with the boarding pass',
  })
  async verifyTicket(@Param('id', ParseIntPipe) id: number, @Query('orderId', ParseIntPipe) orderId: number): Promise<boolean> {
    return this.customersService.verifyTicket(id, orderId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a customer by ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'The ID of the customer to retrieve',
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Customer> {
    return this.customersService.findOne(id);
  }
}
