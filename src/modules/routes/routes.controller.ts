import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Route } from 'common/database/entities/route.entity';
// import { Roles } from 'common/enums/enums';
// import { RolesGuard } from 'common/guards/roles.guard';

import { CreateRouteDto } from './dto/create-route.dto';
import { RoutesService } from './routes.service';

@ApiTags('routes')
@Controller('routes')
export class RoutesController {
  constructor(private readonly routesService: RoutesService) {}

  @Post()
  // @UseGuards(RolesGuard)
  // @SetMetadata('roles', [Roles.SUPERADMIN])
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new route' })
  @ApiResponse({ status: 201, type: Route })
  async create(@Body() createRouteDto: CreateRouteDto): Promise<Route> {
    return this.routesService.create(createRouteDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all routes' })
  @ApiResponse({ status: 200, type: [Route] })
  async findAll(): Promise<Route[]> {
    return this.routesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get route by ID' })
  @ApiResponse({ status: 200, type: Route })
  async findOne(@Param('id') id: number): Promise<Route> {
    return this.routesService.findOneById(id);
  }
}
