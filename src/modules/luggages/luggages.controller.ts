import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';

import { LuggagesService } from './luggages.service';

@Controller('luggages')
export class LuggagesController {
  constructor(private readonly luggagesService: LuggagesService) {}

  @Get('count-in-order')
  findAll(@Query('orderId', ParseIntPipe) orderId: number): Promise<{ countOfLuggages: number }> {
    return this.luggagesService.getCountOfLuggages(orderId);
  }
}
