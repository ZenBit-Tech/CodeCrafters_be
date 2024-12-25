import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LuggageImages } from 'common/database/entities/luggage-imgs.entity';
import { Luggage } from 'common/database/entities/luggage.entity';

import { LuggageImagesController } from './luggage-images.controller';
import { LuggageImagesService } from './luggage-images.service';

@Module({
  imports: [TypeOrmModule.forFeature([LuggageImages, Luggage])],
  controllers: [LuggageImagesController],
  providers: [LuggageImagesService],
  exports: [LuggageImagesService],
})
export class LuggageImagesModule {}
