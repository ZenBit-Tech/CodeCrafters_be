import { OrderStatuses } from 'common/enums/enums';

export interface OrderQueryParams {
  sortBy: string;
  filterBy: keyof typeof OrderStatuses;
  search: string;
  page: number;
  companyId: number;
  isNew: 'true' | 'false';
  startDate: Date;
}

export interface OrderServiceParams {
  sortBy: string;
  filterBy: keyof typeof OrderStatuses;
  search: string;
  page: number;
  companyId: number;
  isNew: boolean;
  startDate: Date | undefined;
}

export interface OrderData {
  id: number;
  collection_date: Date;
  collection_time_start: Date;
  collection_time_end: Date;
  collection_address: string;
  status: string;
  airport_name: string;
  flight_id: string;
  ticket_photo: string;
  failed_reason: string | null;
}
