export enum LuggageTypes {
  SMALL = 'small',
  MIDDLE = 'middle',
  BIG = 'big',
}
export enum NotificationTypes {
  ROUTE = 'route',
  NOTE = 'note',
  START_ROUTE = 'start-route',
  ORDER_FAILURE_REASON = 'order-failure-reason',
}
export enum OrderStatuses {
  COMPLETED = 'Completed',
  FAILED = 'Failed',
  NOT_ARRIVED = 'Not arrived',
  AT_RISK = 'At Risk',
  UPCOMING = 'Upcoming',
}
export enum Roles {
  DRIVER = 'driver',
  DISPATCHER = 'dispatcher',
  ADMIN = 'admin',
  SUPERADMIN = 'superadmin',
}
export enum RouteStatuses {
  UPCOMING = 'Upcoming',
  AT_RISK = 'At Risk',
  ON_TIME = 'On Time',
  FAILED = 'Failed',
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}
