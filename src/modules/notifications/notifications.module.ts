import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from 'common/database/entities/notification.entity';
import { User } from 'common/database/entities/user.entity';

import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';

@Module({
  imports: [TypeOrmModule.forFeature([Notification, User])],
  controllers: [NotificationsController],
  providers: [NotificationsService],
})
export class NotificationsModule {}
