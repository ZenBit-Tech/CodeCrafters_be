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

  notifications.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  notifications.forEach((notification) => {
    const diffTime = Math.floor(Math.abs(now.getTime() - new Date(notification.createdAt).getTime()) / 3600000);
    if (diffTime < 24) {
      getNotificationsResponse.today.push(transformNotification(notification, `${diffTime}h`));
    }
    if (diffTime >= 24 && diffTime < 48) {
      getNotificationsResponse.yesterday.push(transformNotification(notification, 'yesterday'));
    }
    if (diffTime >= 48 && diffTime < 720) {
      getNotificationsResponse.thisMonth.push(transformNotification(notification, 'this moth'));
    }
    if (diffTime >= 720 && diffTime < 8640) {
      getNotificationsResponse.thisYear.push(transformNotification(notification, 'this year'));
    }
  });

  return getNotificationsResponse;
};
