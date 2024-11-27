import { Controller, Get, Query, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Order } from 'common/database/entities/order.entity';
import { Roles } from 'common/enums/enums';
import { RolesGuard } from 'common/guards/roles.guard';
import { UserCompanyGuard } from 'common/guards/userCompany.guard';
import { FailedResponse } from 'common/types/failed-response.dto';
import { stringToBoolean } from 'common/utils/stringToBoolean';

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
    return this.ordersService.findAll({ ...queryParams, isNew: stringToBoolean(queryParams.isNew) });
  }

  @Get('by-dates')
  @ApiQuery({ name: 'date', description: 'date start for filters by collection_date', example: new Date().toISOString() })
  @ApiQuery({ name: 'companyId', description: 'ID of the company for filtering orders', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Map of dates to order counts',
    schema: {
      type: 'object',
      additionalProperties: { type: 'number' },
      example: {
        '2024-11-01': 5,
        '2024-11-02': 3,
      },
    },
  })
  @ApiResponse({
    status: 500,
    type: FailedResponse,
  })
  async findOrdersDates(@Query() { date, companyId }: { date: Date; companyId: number }): Promise<Record<string, number>> {
    return this.ordersService.getDates(date, companyId);
  }

  @Get('by-ids')
  @UseGuards(RolesGuard, UserCompanyGuard)
  @SetMetadata('roles', [Roles.ADMIN, Roles.DISPATCHER])
  @ApiQuery({ name: 'array of id', description: 'array of orders id', example: [1, 2, 3, 4, 5] })
  @ApiResponse({
    status: 200,
    description: 'Orders array',
    type: [Order],
  })
  @ApiResponse({
    status: 500,
    type: FailedResponse,
  })
  async findByIds(@Query() { ordersIdArray }: { ordersIdArray: string }): Promise<Order[]> {
    return this.ordersService.findByIds(<number[]>JSON.parse(ordersIdArray));
  }
}
