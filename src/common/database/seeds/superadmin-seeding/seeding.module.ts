import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'common/database/entities/user.entity';
import { MailerService } from 'common/mailer/mailer.service';

import { SeedingController } from './seeding.controller';
import { SeedingService } from './seeding.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [SeedingController],
  providers: [SeedingService, MailerService],
})
export class SeedingModule {}
