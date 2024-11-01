import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'common/database/entities/user.entity';
import { MailerService } from 'common/mailer/mailer.service';

import { SeedingService } from './seeding.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [],
  providers: [SeedingService, MailerService],
})
export class SeedingModule {}
