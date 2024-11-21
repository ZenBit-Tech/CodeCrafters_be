import { Controller, Get, Query, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Order } from 'common/database/entities/order.entity';
import { Roles } from 'common/enums/enums';
import { RolesGuard } from 'common/guards/roles.guard';
import { FailedResponse } from 'common/types/failed-response.dto';

import { OrdersResponse } from './dto/response.dto';
import { OrdersService } from './orders.service';
import { OrderQueryParams } from './types';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @UseGuards(RolesGuard)
  @SetMetadata('roles', [Roles.ADMIN, Roles.DISPATCHER])
  @ApiOperation({ summary: 'Retrieve a list of orders with filtering, sorting, and pagination' })
  @ApiQuery({ name: 'sort_by', description: 'Sorting criteria in JSON format', example: '{"collection_date":"ASC"}' })
  @ApiQuery({ name: 'filter_by', description: 'Filter orders by status', example: 'COMPLETED' })
  @ApiQuery({ name: 'page', description: 'Page number for pagination', example: 1 })
  @ApiQuery({ name: 'search', description: 'search string', example: 'Alice' })
  @ApiQuery({ name: 'company_id', description: 'ID of the company for filtering orders', example: 1 })
  @ApiResponse({
    status: 200,
    type: OrdersResponse,
  })
  @ApiResponse({
    status: 500,
    type: FailedResponse,
  })
  @ApiResponse({ status: 400, description: 'Invalid query parameters' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async findAll(@Query() queryParams: OrderQueryParams): Promise<{ orders: Order[]; page: number; pagesCount: number }> {
    return this.ordersService.findAll({ ...queryParams, isNew: queryParams.isNew === 'true' });
  }
}
