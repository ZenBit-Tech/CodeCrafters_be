import { HOURS_IN_DAY, HOURS_IN_MONTH, HOURS_IN_TWO_DAYS, HOURS_IN_YEAR, MILLISECONDS_IN_HOUR } from 'common/constants/numbers';
import { Notification } from 'common/database/entities/notification.entity';
import { NotificationTypes } from 'common/enums/enums';

interface TransformedNotification {
  id: number;
  type: NotificationTypes;
  linkText: string;
  linkHref: string;
  message: string;
  timeDifference: string;
}

export interface GetNotificationsResponse {
  today: TransformedNotification[];
  yesterday: TransformedNotification[];
  thisMonth: TransformedNotification[];
  thisYear: TransformedNotification[];
}

const transformNotification = (notification: Notification, diffTime: string) => {
  return {
    id: notification.id,
    type: notification.type,
    linkText: notification.link_text,
    linkHref: notification.link_href,
    message: notification.message,
    timeDifference: diffTime,
  };
};

export const transformNotifications = (notifications: Notification[]): GetNotificationsResponse => {
  const getNotificationsResponse: GetNotificationsResponse = {
    today: [],
    yesterday: [],
    thisMonth: [],
    thisYear: [],
  };
  const now = new Date();

  notifications
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .forEach((notification) => {
      const diffTime = Math.floor(Math.abs(now.getTime() - new Date(notification.createdAt).getTime()) / MILLISECONDS_IN_HOUR);
      if (diffTime < HOURS_IN_DAY) {
        getNotificationsResponse.today.push(transformNotification(notification, `${diffTime}h`));
      }
      if (diffTime >= HOURS_IN_DAY && diffTime < HOURS_IN_TWO_DAYS) {
        getNotificationsResponse.yesterday.push(transformNotification(notification, 'yesterday'));
      }
      if (diffTime >= HOURS_IN_TWO_DAYS && diffTime < HOURS_IN_MONTH) {
        getNotificationsResponse.thisMonth.push(transformNotification(notification, 'this month'));
      }
      if (diffTime >= HOURS_IN_MONTH && diffTime < HOURS_IN_YEAR) {
        getNotificationsResponse.thisYear.push(transformNotification(notification, 'this year'));
      }
    });

  return getNotificationsResponse;
};
