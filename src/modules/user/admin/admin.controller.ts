import { Controller, Post, Patch, Param, Delete, Body } from '@nestjs/common';

import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Controller('admins')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  async create(@Body() adminData: CreateAdminDto): Promise<{ status: number; message?: string; error?: unknown }> {
    return this.adminService.create(adminData);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() adminData: UpdateAdminDto): Promise<{ status: number; message?: string; error?: unknown }> {
    return this.adminService.update(+id, adminData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ status: number; message?: string; error?: unknown }> {
    return this.adminService.remove(+id);
  }
}
