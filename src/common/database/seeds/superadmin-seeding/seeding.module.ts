import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SeedingController } from './seeding.controller';
import { SeedingService } from './seeding.service';
import { User } from '../../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [SeedingController],
  providers: [SeedingService],
})
export class SeedingModule {}
