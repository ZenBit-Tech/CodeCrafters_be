import {
  Controller,
  Post,
  Body,
  UseGuards,
  SetMetadata,
  BadRequestException,
  Get,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { Route } from 'common/database/entities/route.entity';
import { Roles } from 'common/enums/enums';
import { RolesGuard } from 'common/guards/roles.guard';
import { SuccessResponse } from 'common/types/response-success.dto';

import { CreateRouteDto } from './dto/create-route.dto';
import { RouteService } from './route.service';

@Controller('route')
export class RouteController {
  constructor(private readonly routeService: RouteService) {}

  @Post()
  @UseGuards(RolesGuard)
  @SetMetadata('roles', [Roles.ADMIN, Roles.DISPATCHER])
  @ApiOperation({ summary: 'Route creating' })
  @ApiResponse({ status: 201, example: { status: 201, message: 'Routes created successfully' } })
  async create(@Body() createRouteDto: CreateRouteDto[]): Promise<SuccessResponse> {
    return this.routeService.create(createRouteDto);
  }

  @UseGuards(RolesGuard)
  @SetMetadata('roles', [Roles.SUPERADMIN])
  @Get('by-dates')
  @ApiResponse({ status: 200, description: 'Routes found', type: [Route] })
  @ApiResponse({ status: 404, description: 'No routes found' })
  @ApiQuery({ name: 'startDate', type: String, description: 'Start date in YYYY-MM-DD format' })
  @ApiQuery({ name: 'endDate', type: String, description: 'End date in YYYY-MM-DD format' })
  @ApiQuery({ name: 'sortField', type: String, description: 'Field to sort by' })
  @ApiQuery({ name: 'sortDirection', type: String, description: 'Sort direction (asc or desc)' })
  @ApiQuery({ name: 'drivers', type: [String], required: false, description: 'List of drivers' })
  async getRoutesByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('sortField') sortField: string,
    @Query('sortDirection') sortDirection: 'asc' | 'desc',
    @Query('searchQuery') searchQuery?: string,
    @Query('drivers', new ParseArrayPipe({ items: String, optional: true })) drivers?: string[],
  ): Promise<Route[]> {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new BadRequestException('Invalid date format. Use YYYY-MM-DD.');
    }

    return this.routeService.getRoutesByDateRange(start, end, sortField, sortDirection, searchQuery, drivers);
  }

  @UseGuards(RolesGuard)
  @SetMetadata('roles', [Roles.SUPERADMIN])
  @Get(':id')
  @ApiResponse({ status: 200, description: 'Route found', type: Route })
  @ApiResponse({ status: 404, description: 'Route not found' })
  async getRouteById(@Param('id', ParseIntPipe) id: number): Promise<Route> {
    return this.routeService.getRouteById(id);
  }
}
