import { OrderStatuses } from 'common/enums/enums';

export interface OrderQueryParams {
  sort_by: string;
  filter_by: OrderStatuses;
  search: string;
  page: number;
  company_id: number;
}
