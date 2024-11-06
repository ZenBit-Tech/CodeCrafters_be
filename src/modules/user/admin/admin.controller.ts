import { Controller, Post, Patch, Param, Delete, Body, UseGuards, SetMetadata, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags, ApiOperation } from '@nestjs/swagger';
import { User } from 'common/database/entities/user.entity';
import { Roles } from 'common/enums/enums';
import { RolesGuard } from 'common/guards/roles.guard';
import { ResponseInterface } from 'common/types/interfaces';

import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { FailedResponse } from './dto/failed-response.dto';
import { SuccessResponse } from './dto/response-success.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@ApiBearerAuth()
@ApiTags('admin')
@Controller('admins')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  @UseGuards(RolesGuard)
  @SetMetadata('roles', [Roles.SUPERADMIN])
  @ApiOperation({ summary: 'Create admin' })
  @ApiResponse({ status: 201, type: SuccessResponse })
  @ApiResponse({ status: 400, type: FailedResponse })
  async create(@Body() adminData: CreateAdminDto): Promise<ResponseInterface> {
    return this.adminService.create(adminData);
  }

  @Get()
  @UseGuards(RolesGuard)
  @SetMetadata('roles', [Roles.SUPERADMIN])
  @ApiOperation({ summary: 'Get list of admins' })
  @ApiResponse({ status: 200, type: [User] })
  @ApiResponse({ status: 400, type: FailedResponse })
  async getList(): Promise<User[] | ResponseInterface> {
    return this.adminService.getAll();
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @SetMetadata('roles', [Roles.SUPERADMIN])
  @ApiOperation({ summary: 'Update admin' })
  @ApiResponse({ status: 200, type: SuccessResponse })
  @ApiResponse({ status: 400, type: FailedResponse })
  async update(@Param('id') id: string, @Body() adminData: UpdateAdminDto): Promise<ResponseInterface> {
    return this.adminService.update(+id, adminData);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @SetMetadata('roles', [Roles.SUPERADMIN])
  @ApiOperation({ summary: 'Delete admin' })
  @ApiResponse({ status: 200, type: SuccessResponse })
  @ApiResponse({ status: 400, type: FailedResponse })
  async remove(@Param('id') id: string): Promise<ResponseInterface> {
    return this.adminService.remove(+id);
  }
}
