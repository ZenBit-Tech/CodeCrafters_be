import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from 'common/database/entities/notification.entity';
import { User } from 'common/database/entities/user.entity';
import { GetNotificationsResponse, transformNotifications } from 'common/utils/transformNotifications';
import { Repository } from 'typeorm';

import { CreateNotificationDto } from './dto/notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationsRepo: Repository<Notification>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(createNotificationDto: CreateNotificationDto): Promise<Notification> {
    const { userId, ...notificationData } = createNotificationDto;

    // todo try catch statement
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const notification = this.notificationsRepo.create({
      ...notificationData,
      user_id: user,
    });

    return this.notificationsRepo.save(notification);
  }

  async getNotifications(userId: number): Promise<GetNotificationsResponse> {
    try {
      const notifications = await this.notificationsRepo.find({ where: { user_id: { id: userId } } });

      return transformNotifications(notifications);
    } catch (error) {
      throw new NotFoundException('Cant get notifications');
    }
  }
}
