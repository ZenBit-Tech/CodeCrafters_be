import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from 'common/database/entities/notification.entity';
import { User } from 'common/database/entities/user.entity';
import { GetNotificationsResponse, transformNotifications } from 'common/utils/transformNotifications';
import { EntityManager, Repository } from 'typeorm';

import { CreateNotificationDto } from './dto/notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationsRepo: Repository<Notification>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    private readonly entityManager: EntityManager,
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

  async getUnreadNotificationsCount(userId: number): Promise<{ count: number }> {
    try {
      const count = await this.notificationsRepo.count({ where: { user_id: { id: userId }, is_readed: false } });

      return { count };
    } catch (error) {
      throw new NotFoundException('There is no such user');
    }
  }

  async readAllNotifications(userId: number): Promise<boolean> {
    try {
      const notifications = await this.notificationsRepo.find({ where: { user_id: { id: userId }, is_readed: false } });

      const readNotifications = notifications.map((notification) => {
        notification.is_readed = true;
        return notification;
      });

      await this.entityManager.save(readNotifications);
      return true;
    } catch (error) {
      return false;
    }
  }
}
