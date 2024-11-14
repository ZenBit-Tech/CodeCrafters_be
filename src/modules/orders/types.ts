import { OrderStatuses } from 'common/enums/enums';

export interface OrderQueryParams {
  sortBy: string;
  filterBy: OrderStatuses;
  search: string;
  page: number;
  companyId: number;
}
