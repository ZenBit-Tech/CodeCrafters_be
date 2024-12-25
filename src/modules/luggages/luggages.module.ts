import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Luggage } from 'common/database/entities/luggage.entity';

import { LuggagesController } from './luggages.controller';
import { LuggagesService } from './luggages.service';

@Module({
  imports: [TypeOrmModule.forFeature([Luggage])],
  controllers: [LuggagesController],
  providers: [LuggagesService],
})
export class LuggagesModule {}
