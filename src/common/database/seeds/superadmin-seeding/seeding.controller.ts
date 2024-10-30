import { Controller, Post } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';

import { SeedingService } from './seeding.service';

@ApiExcludeController()
@Controller('seeding')
export class SeedingController {
  constructor(private readonly seedingService: SeedingService) {}

  @Post()
  seed() {
    return this.seedingService.seed();
  }
}
