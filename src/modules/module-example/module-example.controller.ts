import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';

import { CreateModuleExampleDto } from './dto/create-module-example.dto';
import { UpdateModuleExampleDto } from './dto/update-module-example.dto';
import { ModuleExampleService } from './module-example.service';

@Controller('module-example')
export class ModuleExampleController {
  constructor(private readonly moduleExampleService: ModuleExampleService) {}

  @Post()
  async create(@Body() createModuleExampleDto: CreateModuleExampleDto) {
    return this.moduleExampleService.create(createModuleExampleDto);
  }

  @Get()
  async findAll() {
    return this.moduleExampleService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.moduleExampleService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateModuleExampleDto: UpdateModuleExampleDto) {
    return this.moduleExampleService.update(+id, updateModuleExampleDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.moduleExampleService.remove(+id);
  }
}
