import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, SetMetadata } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { User } from 'common/database/entities/user.entity';
import { Roles } from 'common/enums/enums';
import { RolesGuard } from 'common/guards/roles.guard';
import { UserCompanyGuard } from 'common/guards/userCompany.guard';
import { ResponseInterface } from 'common/types/interfaces';

import { DriverService } from './driver.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';

@Controller('driver')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @Post()
  @UseGuards(RolesGuard, UserCompanyGuard)
  @SetMetadata('roles', [Roles.ADMIN, Roles.DISPATCHER])
  @ApiOperation({ summary: 'Create driver' })
  @ApiResponse({ status: 201, type: User })
  async create(@Body() createDriverDto: CreateDriverDto): Promise<User> {
    return this.driverService.create(createDriverDto);
  }

  @Get(':id')
  @UseGuards(RolesGuard, UserCompanyGuard)
  @SetMetadata('roles', [Roles.ADMIN, Roles.DISPATCHER])
  @ApiOperation({ summary: 'Get driver' })
  @ApiResponse({ status: 200, type: User })
  async findOne(@Param('id') id: string): Promise<User> {
    return this.driverService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard, UserCompanyGuard)
  @SetMetadata('roles', [Roles.ADMIN, Roles.DISPATCHER])
  @ApiOperation({ summary: 'Update driver' })
  async update(@Param('id') id: string, @Body() updateDriverDto: UpdateDriverDto): Promise<ResponseInterface> {
    return this.driverService.update(+id, updateDriverDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard, UserCompanyGuard)
  @SetMetadata('roles', [Roles.ADMIN, Roles.DISPATCHER])
  @ApiOperation({ summary: 'Delete driver' })
  async remove(@Param('id') id: string): Promise<ResponseInterface> {
    return this.driverService.remove(+id);
  }
}
