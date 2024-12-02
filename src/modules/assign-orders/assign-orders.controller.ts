import { Controller, Get, Query } from '@nestjs/common';
// import { Roles } from 'common/enums/enums';
// import { RolesGuard } from 'common/guards/roles.guard';

import { AssignOrdersService, RoutesInform } from './assign-orders.service';

@Controller('assign-orders')
export class AssignOrdersController {
  constructor(private readonly assignOrdersService: AssignOrdersService) {}

  @Get()
  // @UseGuards(RolesGuard)
  // @SetMetadata('roles', [Roles.DISPATCHER])
  async createRoutes(@Query() { driversIds, ordersIds }: { driversIds: string; ordersIds: string }): Promise<RoutesInform> {
    return this.assignOrdersService.getAndAssign(<number[]>JSON.parse(driversIds), <number[]>JSON.parse(ordersIds));
  }
}
