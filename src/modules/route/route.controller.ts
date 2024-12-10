import {
  Controller,
  Post,
  Body,
  UseGuards,
  SetMetadata,
  BadRequestException,
  Get,
  ParseArrayPipe,
  Query,
  Param,
  Patch,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { Route } from 'common/database/entities/route.entity';
import { Roles } from 'common/enums/enums';
import { RolesGuard } from 'common/guards/roles.guard';
import { UserCompanyGuard } from 'common/guards/userCompany.guard';
import { FailedResponse } from 'common/types/failed-response.dto';
import { SuccessResponse } from 'common/types/response-success.dto';
import { RouteInform } from 'common/types/routeInformResponse';

import { CreateRouteDto } from './dto/create-route.dto';
import { RouteService } from './route.service';
import { RouteData } from './types';

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
  @SetMetadata('roles', [Roles.ADMIN, Roles.DISPATCHER])
  @Get('list-filters')
  @ApiOperation({ summary: 'Get unique filters (drivers, stops, statuses) for dropdowns' })
  @ApiResponse({ status: 200, description: 'Unique filter values retrieved', type: Object })
  async getRouteFilters(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<{ drivers: string[]; stops: number[]; statuses: string[] }> {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      throw new BadRequestException('Invalid date format. Use YYYY-MM-DD.');
    }

    return this.routeService.getRouteFilters(start, end);
  }

  @UseGuards(RolesGuard)
  @SetMetadata('roles', [Roles.ADMIN, Roles.DISPATCHER])
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
    @Query('stopsCount', new ParseArrayPipe({ items: Number, optional: true })) stopsCount?: number[],
    @Query('statuses', new ParseArrayPipe({ items: String, optional: true })) statuses?: string[],
  ): Promise<RouteData[]> {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      throw new BadRequestException('Invalid date format. Use YYYY-MM-DD.');
    }

    return this.routeService.getRoutesByDateRange(start, end, sortField, sortDirection, searchQuery, drivers, stopsCount, statuses);
  }

  @Get('by-date-range')
  @UseGuards(RolesGuard, UserCompanyGuard)
  @SetMetadata('roles', [Roles.ADMIN, Roles.DISPATCHER])
  @ApiOperation({ summary: 'Route route details' })
  @ApiResponse({ status: 200, example: { status: 200, type: [Route] } })
  @ApiResponse({ status: 400, type: FailedResponse })
  async getRoutesForRender(@Query('from') from: Date, @Query('to') to: Date): Promise<RouteInform[]> {
    return this.routeService.getRoutesForRender(from, to);
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @SetMetadata('roles', [Roles.ADMIN, Roles.DISPATCHER])
  @ApiOperation({ summary: 'Route route details' })
  @ApiResponse({ status: 200, example: { status: 200, type: Route } })
  @ApiResponse({ status: 400, type: FailedResponse })
  async getRouteDetails(@Param('id') id: number): Promise<RouteInform> {
    return this.routeService.getOne(+id);
  }

  @Get('driver/:id')
  @UseGuards(RolesGuard)
  @SetMetadata('roles', [Roles.DRIVER])
  @ApiOperation({ summary: 'Route details for driver' })
  @ApiResponse({ status: 200, example: { status: 200, type: Route } })
  @ApiResponse({ status: 400, type: FailedResponse })
  async getRouteDetailsForDriver(@Param('id') userId: number): Promise<RouteInform> {
    return this.routeService.getOneForDriver(+userId);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @SetMetadata('roles', [Roles.ADMIN, Roles.DISPATCHER])
  @ApiOperation({ summary: 'Remove order from route' })
  @ApiResponse({ status: 200, example: { status: 200, type: Route } })
  @ApiResponse({ status: 400, type: FailedResponse })
  async updateRoute(@Param('id', ParseIntPipe) id: number, @Query('orderId', ParseIntPipe) orderId: number): Promise<RouteInform> {
    return this.routeService.removeOrderFromRoute(id, orderId);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @SetMetadata('roles', [Roles.ADMIN, Roles.DISPATCHER])
  @ApiOperation({ summary: 'Remove order from route' })
  @ApiResponse({ status: 200, example: { status: 200, type: SuccessResponse } })
  @ApiResponse({ status: 400, type: FailedResponse })
  async deleteRoute(@Param('id', ParseIntPipe) id: number): Promise<SuccessResponse> {
    return this.routeService.deleteRoute(id);
  }
}
