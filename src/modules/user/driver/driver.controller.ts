import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, SetMetadata, Headers } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { User } from 'common/database/entities/user.entity';
import { Roles } from 'common/enums/enums';
import { RolesGuard } from 'common/guards/roles.guard';
import { ResponseInterface } from 'common/types/interfaces';

import { DriverService } from './driver.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';

@Controller('driver')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @Post()
  @UseGuards(RolesGuard)
  @SetMetadata('roles', [Roles.ADMIN, Roles.DISPATCHER])
  @ApiOperation({ summary: 'Create driver' })
  @ApiResponse({ status: 201, type: User })
  async create(@Body() createDriverDto: CreateDriverDto, @Headers() { authorization }: { authorization: string }): Promise<User> {
    return this.driverService.create(createDriverDto, authorization);
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @SetMetadata('roles', [Roles.ADMIN, Roles.DISPATCHER])
  @ApiOperation({ summary: 'Get driver' })
  @ApiResponse({ status: 200, type: User })
  async findOne(@Param('id') id: string, @Headers() { authorization }: { authorization: string }): Promise<User> {
    return this.driverService.findOne(+id, authorization);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @SetMetadata('roles', [Roles.ADMIN, Roles.DISPATCHER])
  @ApiOperation({ summary: 'Update driver' })
  async update(
    @Param('id') id: string,
    @Body() updateDriverDto: UpdateDriverDto,
    @Headers() { authorization }: { authorization: string },
  ): Promise<ResponseInterface> {
    return this.driverService.update(+id, updateDriverDto, authorization);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @SetMetadata('roles', [Roles.ADMIN, Roles.DISPATCHER])
  @ApiOperation({ summary: 'Delete driver' })
  async remove(@Param('id') id: string, @Headers() { authorization }: { authorization: string }): Promise<ResponseInterface> {
    return this.driverService.remove(+id, authorization);
  }
}
