import { Controller, Get, Post, Body, Param, Delete, Headers, Patch, UseGuards, SetMetadata } from '@nestjs/common';
import { User } from 'common/database/entities/user.entity';
import { Roles } from 'common/enums/enums';
import { RolesGuard } from 'common/guards/roles.guard';

import { DispatcherService } from './dispatcher.service';
import { CreateDispatcherDto } from './dto/create-dispatcher.dto';
import { UpdateDispatcherDto } from './dto/update-dispatcher.dto';

@Controller('dispatcher')
export class DispatcherController {
  constructor(private readonly dispatcherService: DispatcherService) {}

  @Post()
  @UseGuards(RolesGuard)
  @SetMetadata('roles', [Roles.ADMIN])
  async create(@Body() createDispatcherDto: CreateDispatcherDto, @Headers() { authorization }: { authorization: string }): Promise<User> {
    return this.dispatcherService.create(createDispatcherDto, authorization);
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @SetMetadata('roles', [Roles.ADMIN])
  async findOne(@Param('id') id: string, @Headers() { authorization }: { authorization: string }): Promise<User> {
    return this.dispatcherService.findOne(+id, authorization);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @SetMetadata('roles', [Roles.ADMIN])
  async update(
    @Param('id') id: string,
    @Body() updateDispatcherDto: UpdateDispatcherDto,
    @Headers() { authorization }: { authorization: string },
  ) {
    return this.dispatcherService.update(+id, updateDispatcherDto, authorization);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @SetMetadata('roles', [Roles.ADMIN])
  async remove(@Param('id') id: string, @Headers() { authorization }: { authorization: string }) {
    return this.dispatcherService.remove(+id, authorization);
  }
}
