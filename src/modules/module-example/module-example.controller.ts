import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';

import { CreateModuleExampleDto } from './dto/create-module-example.dto';
import { UpdateModuleExampleDto } from './dto/update-module-example.dto';
import { ModuleExampleService } from './module-example.service';
import { Company } from 'common/database/entities/company.entity';
import { DeleteResult } from 'typeorm';
import { IError } from 'common/types/interfaces';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('companies')
@Controller('module-example')
export class ModuleExampleController {
  constructor(private readonly moduleExampleService: ModuleExampleService) {}

  @Post()
  @ApiOperation({ summary: 'Company creating' })
  @ApiResponse({ status: 201, type: Company })
  async create(@Body() createModuleExampleDto: CreateModuleExampleDto): Promise<Company | IError> {
    return this.moduleExampleService.create(createModuleExampleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all companies' })
  @ApiResponse({
    status: 200,
    type: Company,
  })
  async findAll(): Promise<Company[] | IError> {
    return this.moduleExampleService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one company' })
  @ApiResponse({
    status: 200,
    type: Company,
  })
  async findOne(@Param('id') id: string): Promise<Company | IError> {
    return this.moduleExampleService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update company by id' })
  @ApiResponse({
    status: 200,
    type: Company,
  })
  async update(@Param('id') id: string, @Body() updateModuleExampleDto: UpdateModuleExampleDto): Promise<Company | IError> {
    return this.moduleExampleService.update(+id, updateModuleExampleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete company by id' })
  async remove(@Param('id') id: string): Promise<DeleteResult | IError> {
    return this.moduleExampleService.remove(+id);
  }
}
