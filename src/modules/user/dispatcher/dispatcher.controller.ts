import { Controller, Get, Post, Body, Param, Delete, Headers, Patch, UseGuards, SetMetadata } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from 'common/database/entities/user.entity';
import { Roles } from 'common/enums/enums';
import { RolesGuard } from 'common/guards/roles.guard';
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
  @UseGuards(RolesGuard)
  @SetMetadata('roles', [Roles.ADMIN])
  @ApiOperation({ summary: 'Create dispatcher' })
  @ApiResponse({ status: 201, type: User })
  @ApiResponse({ status: 400, type: FailedResponse })
  async create(@Body() createDispatcherDto: CreateDispatcherDto, @Headers() { authorization }: { authorization: string }): Promise<User> {
    return this.dispatcherService.create(createDispatcherDto, authorization);
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @SetMetadata('roles', [Roles.ADMIN])
  @ApiOperation({ summary: 'Get dispatcher' })
  @ApiResponse({ status: 200, type: User })
  @ApiResponse({ status: 400, type: FailedResponse })
  async findOne(@Param('id') id: string, @Headers() { authorization }: { authorization: string }): Promise<User> {
    return this.dispatcherService.findOne(+id, authorization);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @SetMetadata('roles', [Roles.ADMIN])
  @ApiOperation({ summary: 'Update dispatcher' })
  @ApiResponse({ status: 200, type: SuccessResponse })
  @ApiResponse({ status: 400, type: FailedResponse })
  async update(
    @Param('id') id: string,
    @Body() updateDispatcherDto: UpdateDispatcherDto,
    @Headers() { authorization }: { authorization: string },
  ): Promise<ResponseInterface> {
    return this.dispatcherService.update(+id, updateDispatcherDto, authorization);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @SetMetadata('roles', [Roles.ADMIN])
  @ApiOperation({ summary: 'Delete dispatcher' })
  @ApiResponse({ status: 200, type: SuccessResponse })
  @ApiResponse({ status: 400, type: FailedResponse })
  async remove(@Param('id') id: string, @Headers() { authorization }: { authorization: string }): Promise<ResponseInterface> {
    return this.dispatcherService.remove(+id, authorization);
  }
}
