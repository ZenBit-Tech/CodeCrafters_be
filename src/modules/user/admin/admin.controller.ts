import { Controller, Post, Patch, Param, Delete, Body } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags, ApiOperation } from '@nestjs/swagger';

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
  @ApiOperation({ summary: 'Create admin' })
  @ApiResponse({ status: 201, type: SuccessResponse })
  @ApiResponse({ status: 400, type: FailedResponse })
  async create(@Body() adminData: CreateAdminDto): Promise<{ status: number; message?: string; error?: unknown }> {
    return this.adminService.create(adminData);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update admin' })
  @ApiResponse({ status: 200, type: SuccessResponse })
  @ApiResponse({ status: 400, type: FailedResponse })
  async update(@Param('id') id: string, @Body() adminData: UpdateAdminDto): Promise<{ status: number; message?: string; error?: unknown }> {
    return this.adminService.update(+id, adminData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete admin' })
  @ApiResponse({ status: 200, type: SuccessResponse })
  @ApiResponse({ status: 400, type: FailedResponse })
  async remove(@Param('id') id: string): Promise<{ status: number; message?: string; error?: unknown }> {
    return this.adminService.remove(+id);
  }
}
