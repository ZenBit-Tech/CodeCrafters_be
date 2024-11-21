import { Roles } from 'common/enums/enums';

export interface UserQueryParams {
  sortBy?: string;
  filterBy?: Roles;
  page?: number;
  search?: string;
}
