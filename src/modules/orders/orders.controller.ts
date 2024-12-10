import { Controller, Get, Query, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Order } from 'common/database/entities/order.entity';
import { User } from 'common/database/entities/user.entity';
import { ParseAssignOrdersJson } from 'common/decorators/parseJsonDecorator';
import { Roles } from 'common/enums/enums';
import { RolesGuard } from 'common/guards/roles.guard';
import { AssignedOrdersResponse } from 'common/types/assignedOrdersResponse';
import { FailedResponse } from 'common/types/failed-response.dto';
import { OrderWithRouteAndCustomer } from 'common/types/interfaces';
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

  @Get('assign-orders')
  @UseGuards(RolesGuard)
  @SetMetadata('roles', [Roles.DISPATCHER])
  @ApiOperation({ summary: 'Get assigned orders for the selected drivers' })
  @ApiResponse({ status: 200, example: { value: [{ driver: User, orders: [Order] }], notAssignedOrders: [Order] } })
  @ApiResponse({ status: 500, type: FailedResponse })
  async createRoutes(
    @ParseAssignOrdersJson() { driversIds, ordersIds }: { driversIds: number[]; ordersIds: number[] },
  ): Promise<AssignedOrdersResponse> {
    return this.ordersService.getAndAssign(driversIds, ordersIds);
  }

  @Get('by-driver')
  @UseGuards(RolesGuard)
  @SetMetadata('roles', [Roles.ADMIN, Roles.DRIVER])
  @ApiOperation({ summary: 'Get orders assigned for the driver on the selected date' })
  @ApiQuery({ name: 'date', description: 'Date for handling orders only for assigned date', example: new Date().toISOString() })
  @ApiQuery({ name: 'driverId', description: 'Driver id to get orders assigned to appropriate driver', example: 1 })
  @ApiResponse({
    status: 200,
    example: {
      orders: [
        {
          orderId: 1,
          routeId: 1,
          collectionTimeStart: new Date(),
          collectionTimeEnd: new Date(),
          customerName: 'Customer Name',
          customerPhone: '+12345678',
        },
      ],
    },
  })
  @ApiResponse({ status: 500, type: FailedResponse })
  async findOrdersByDriverAndDate(@Query() { date, driverId }: { date: Date; driverId: number }): Promise<OrderWithRouteAndCustomer[]> {
    const parsedDate = new Date(date);
    return this.ordersService.getOrdersByDriverAndDate(driverId, parsedDate);
  }
}
