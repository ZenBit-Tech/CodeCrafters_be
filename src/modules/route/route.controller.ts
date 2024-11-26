import { Controller, Post, Body, UseGuards, SetMetadata } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Roles } from 'common/enums/enums';
import { RolesGuard } from 'common/guards/roles.guard';
import { UserCompanyGuard } from 'common/guards/userCompany.guard';
import { SuccessResponse } from 'common/types/response-success.dto';

import { CreateRouteDto } from './dto/create-route.dto';
import { RouteService } from './route.service';

@Controller('route')
export class RouteController {
  constructor(private readonly routeService: RouteService) {}

  @Post()
  @UseGuards(RolesGuard, UserCompanyGuard)
  @SetMetadata('roles', [Roles.ADMIN, Roles.DISPATCHER])
  @ApiOperation({ summary: 'Route creating' })
  @ApiResponse({ status: 201, example: { status: 201, message: 'Routes created successfully' } })
  async create(@Body() createRouteDto: CreateRouteDto[]): Promise<SuccessResponse> {
    return this.routeService.create(createRouteDto);
  }
}
