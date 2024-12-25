import { Controller, Get, ParseIntPipe, Query, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Luggage } from 'common/database/entities/luggage.entity';
import { Roles } from 'common/enums/enums';
import { RolesGuard } from 'common/guards/roles.guard';

import { LuggagesService } from './luggages.service';

@Controller('luggages')
@ApiTags('Luggages')
export class LuggagesController {
  constructor(private readonly luggagesService: LuggagesService) {}

  @Get('for-weight-calculation')
  @UseGuards(RolesGuard)
  @SetMetadata('roles', [Roles.DRIVER])
  @ApiQuery({
    name: 'orderId',
    type: Number,
    description: 'The ID of the order associated with the luggages',
  })
  @ApiOperation({ summary: 'Get count of luggages for specific order' })
  @ApiResponse({
    status: 200,
    description: 'Get count of luggages request success',
    example: [
      {
        id: 6,
        luggage_type: 'small',
        luggage_weight: 5,
        luggage_description: '',
      },
      {
        id: 7,
        luggage_type: 'middle',
        luggage_weight: 7,
        luggage_description: '',
      },
      {
        id: 8,
        luggage_type: 'big',
        luggage_weight: 23,
        luggage_description: '',
      },
    ],
  })
  findAll(@Query('orderId', ParseIntPipe) orderId: number): Promise<Luggage[]> {
    return this.luggagesService.getCountOfLuggages(orderId);
  }
}
