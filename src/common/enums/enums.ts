export enum LuggageTypes {
  SMALL = 'small',
  MIDDLE = 'middle',
  BIG = 'big',
}
export enum NotificationTypes {
  ROUTE = 'route',
  BELL = 'bell',
  LUGGAGE = 'luggage',
  MAP_PIN = 'map-pin',
  START_ROUTE = 'start-route',
  ORDER_FAILURE_REASON = 'order-failure-reason',
}
export enum OrderStatuses {
  COMPLETED = 'Completed',
  FAILED = 'Failed',
  NOT_ARRIVED = 'Not arrived',
  AT_RISK = 'At Risk',
  UPCOMING = 'Upcoming',
  ON_TIME = 'On Time',
  EMPTY_STATUS = '',
  CUSTOMER_INFORMED = 'Customer Informed',
  TRANSPORTER_LOCKED = 'Transporter Locked',
  IDENTITY_VERIFIED = 'Identity Verified',
  BOARDING_PASS_VERIFIED = 'Boarding pass verified',
  BAGGAGE_CONFIRMED = 'Baggage confirmed',
  CUSTOMER_CONFIRMED = 'Customer confirmed',
  BAGGAGE_RECORDED = 'Baggage recorded',
  BAGGAGE_COVERED = 'Baggage covered',
  LOADED_INTO_VEHICLE = 'Loaded into vehicle',
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
