import { Controller, Get, Post, Body, Param, Delete, Patch, UseGuards, SetMetadata } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from 'common/database/entities/user.entity';
import { Roles } from 'common/enums/enums';
import { RolesGuard } from 'common/guards/roles.guard';
import { UserCompanyGuard } from 'common/guards/userCompany.guard';
import { FailedResponse } from 'common/types/failed-response.dto';
import { ResponseInterface } from 'common/types/interfaces';
import { SuccessResponse } from 'common/types/response-success.dto';

import { DispatcherService } from './dispatcher.service';
import { CreateDispatcherDto } from './dto/create-dispatcher.dto';
import { UpdateDispatcherDto } from './dto/update-dispatcher.dto';

@ApiBearerAuth()
@ApiTags('dispatcher')
@Controller('dispatcher')
export class DispatcherController {
  constructor(private readonly dispatcherService: DispatcherService) {}

  @Post()
  @UseGuards(RolesGuard, UserCompanyGuard)
  @SetMetadata('roles', [Roles.ADMIN])
  @ApiOperation({ summary: 'Create dispatcher' })
  @ApiResponse({ status: 201, type: User })
  @ApiResponse({ status: 400, type: FailedResponse })
  async create(@Body() createDispatcherDto: CreateDispatcherDto): Promise<User> {
    return this.dispatcherService.create(createDispatcherDto);
  }

  @Get(':id')
  @UseGuards(RolesGuard, UserCompanyGuard)
  @SetMetadata('roles', [Roles.ADMIN])
  @ApiOperation({ summary: 'Get dispatcher' })
  @ApiResponse({ status: 200, type: User })
  @ApiResponse({ status: 400, type: FailedResponse })
  async findOne(@Param('id') id: string): Promise<User> {
    return this.dispatcherService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard, UserCompanyGuard)
  @SetMetadata('roles', [Roles.ADMIN])
  @ApiOperation({ summary: 'Update dispatcher' })
  @ApiResponse({ status: 200, type: SuccessResponse })
  @ApiResponse({ status: 400, type: FailedResponse })
  async update(@Param('id') id: string, @Body() updateDispatcherDto: UpdateDispatcherDto): Promise<ResponseInterface> {
    return this.dispatcherService.update(+id, updateDispatcherDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard, UserCompanyGuard)
  @SetMetadata('roles', [Roles.ADMIN])
  @ApiOperation({ summary: 'Delete dispatcher' })
  @ApiResponse({ status: 200, type: SuccessResponse })
  @ApiResponse({ status: 400, type: FailedResponse })
  async remove(@Param('id') id: string): Promise<ResponseInterface> {
    return this.dispatcherService.remove(+id);
  }
}
