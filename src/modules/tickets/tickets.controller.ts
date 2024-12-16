import { Controller, Get, Param, StreamableFile } from '@nestjs/common';

import { TicketsService } from './tickets.service';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly service: TicketsService) {}

  @Get(':path')
  getFile(@Param('path') path: string): StreamableFile {
    return this.service.findOne(path);
  }
}
