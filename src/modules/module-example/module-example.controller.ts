import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, SetMetadata } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Company } from 'common/database/entities/company.entity';
import { Roles } from 'common/enums/enums';
import { RolesGuard } from 'common/guards/roles.guard';
import { Error } from 'common/types/interfaces';
import { DeleteResult } from 'typeorm';

import { CreateModuleExampleDto } from './dto/create-module-example.dto';
import { UpdateModuleExampleDto } from './dto/update-module-example.dto';
import { ModuleExampleService } from './module-example.service';

@ApiBearerAuth()
@ApiTags('companies')
@Controller('module-example')
export class ModuleExampleController {
  constructor(private readonly moduleExampleService: ModuleExampleService) {}

  @Post()
  @ApiOperation({ summary: 'Company creating' })
  @ApiResponse({ status: 201, type: Company })
  async create(@Body() createModuleExampleDto: CreateModuleExampleDto): Promise<Company | Error> {
    return this.moduleExampleService.create(createModuleExampleDto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @SetMetadata('roles', [Roles.ADMIN])
  @ApiOperation({ summary: 'Get all companies' })
  @ApiResponse({
    status: 200,
    type: Company,
  })
  async findAll(): Promise<Company[] | Error> {
    return this.moduleExampleService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one company' })
  @ApiResponse({
    status: 200,
    type: Company,
  })
  async findOne(@Param('id') id: string): Promise<Company | Error> {
    return this.moduleExampleService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update company by id' })
  @ApiResponse({
    status: 200,
    type: Company,
  })
  async update(@Param('id') id: string, @Body() updateModuleExampleDto: UpdateModuleExampleDto): Promise<Company | Error> {
    return this.moduleExampleService.update(+id, updateModuleExampleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete company by id' })
  async remove(@Param('id') id: string): Promise<DeleteResult | Error> {
    return this.moduleExampleService.remove(+id);
  }
}
