import { OrderStatuses, RouteStatuses } from 'common/enums/enums';

export interface RouteInform {
  id: number;
  submission_date: Date;
  arrival_date: Date;
  distance: number;
  status: RouteStatuses;
  driver: {
    id: number;
    full_name: string;
    email: string;
  };
  orders: {
    id: number;
    collection_date: Date;
    collection_time_start: Date;
    collection_time_end: Date;
    collection_address: string;
    status: OrderStatuses;
  }[];
}
