import { OrderStatuses } from 'common/enums/enums';

export interface OrderQueryParams {
  sortBy: string;
  filterBy: keyof typeof OrderStatuses;
  search: string;
  page: number;
  companyId: number;
  isNew: 'true' | 'false';
}

export interface OrderServiceParams {
  sortBy: string;
  filterBy: keyof typeof OrderStatuses;
  search: string;
  page: number;
  companyId: number;
  isNew: boolean;
}
