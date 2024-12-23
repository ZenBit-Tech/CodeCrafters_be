import { Controller, Post, Body, UseGuards, SetMetadata, Get, ParseIntPipe, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Notification } from 'common/database/entities/notification.entity';
import { Roles } from 'common/enums/enums';
import { RolesGuard } from 'common/guards/roles.guard';
import { GetNotificationsResponse } from 'common/utils/transformNotifications';

import { CreateNotificationDto } from './dto/notification.dto';
import { NotificationsService } from './notifications.service';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @SetMetadata('roles', [Roles.DRIVER])
  @ApiOperation({ summary: 'Create a new notification' })
  @ApiResponse({ status: 201, description: 'Notification created', type: Notification })
  async create(@Body() createNotificationDto: CreateNotificationDto): Promise<Notification> {
    return this.notificationsService.create(createNotificationDto);
  }

  @Get(':userId')
  @UseGuards(RolesGuard)
  @SetMetadata('roles', [Roles.DRIVER])
  @ApiOperation({ summary: 'Get all notifications by driver id' })
  @ApiResponse({
    status: 200,
    description: 'Get notifications successfully',
    example: {
      today: [
        {
          id: 3,
          type: 'route',
          linkText: '9',
          linkHref: '9',
          message: 'You have received new route #000125',
          timeDifference: '2h',
        },
        {
          id: 1,
          type: 'bell',
          linkText: '9',
          linkHref: '9',
          message: 'You have received new route #000125',
          timeDifference: '2h',
        },
        {
          id: 2,
          type: 'luggage',
          linkText: '9',
          linkHref: '9',
          message: 'You have received new route #000125',
          timeDifference: '2h',
        },
      ],
      yesterday: [],
      thisMonth: [],
      thisYear: [],
    },
  })
  async getAll(@Param('userId', ParseIntPipe) userId: number): Promise<GetNotificationsResponse> {
    return this.notificationsService.getNotifications(userId);
  }
}
