import { Controller, Get, Query, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Order } from 'common/database/entities/order.entity';
import { User } from 'common/database/entities/user.entity';
import { Roles } from 'common/enums/enums';
import { RolesGuard } from 'common/guards/roles.guard';
import { AssignedOrdersResponse } from 'common/types/assignedOrdersResponse';
import { FailedResponse } from 'common/types/failed-response.dto';

import { AssignOrdersService } from './assign-orders.service';

@Controller('assign-orders')
export class AssignOrdersController {
  constructor(private readonly assignOrdersService: AssignOrdersService) {}

  @Get()
  @UseGuards(RolesGuard)
  @SetMetadata('roles', [Roles.DISPATCHER])
  @ApiOperation({ summary: 'Get assigned orders for the selected drivers' })
  @ApiResponse({ status: 200, example: { value: [{ driver: User, orders: [Order] }], notAssignedOrders: [Order] } })
  @ApiResponse({ status: 500, type: FailedResponse })
  async createRoutes(@Query() { driversIds, ordersIds }: { driversIds: string; ordersIds: string }): Promise<AssignedOrdersResponse> {
    return this.assignOrdersService.getAndAssign(<number[]>JSON.parse(driversIds), <number[]>JSON.parse(ordersIds));
  }
}
