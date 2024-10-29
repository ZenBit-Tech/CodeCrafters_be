import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerService } from 'common/mailer/mailer.service';

import { SeedingController } from './seeding.controller';
import { SeedingService } from './seeding.service';
import { User } from '../../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [SeedingController],
  providers: [SeedingService, MailerService],
})
export class SeedingModule {}
