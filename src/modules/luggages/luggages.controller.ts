import { Controller, Get, ParseIntPipe, Query, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'common/enums/enums';
import { RolesGuard } from 'common/guards/roles.guard';

import { LuggagesService } from './luggages.service';

@Controller('luggages')
@ApiTags('Luggages')
export class LuggagesController {
  constructor(private readonly luggagesService: LuggagesService) {}

  @Get('count-in-order')
  @UseGuards(RolesGuard)
  @SetMetadata('roles', [Roles.DRIVER])
  @ApiQuery({
    name: 'orderId',
    type: Number,
    description: 'The ID of the order associated with the luggages',
  })
  @ApiOperation({ summary: 'Get count of luggages for specific order' })
  @ApiResponse({ status: 200, description: 'Get count of luggages request success', example: { countOfLuggages: 8 } })
  findAll(@Query('orderId', ParseIntPipe) orderId: number): Promise<{ countOfLuggages: number }> {
    return this.luggagesService.getCountOfLuggages(orderId);
  }
}
