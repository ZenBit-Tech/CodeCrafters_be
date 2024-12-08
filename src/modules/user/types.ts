import { Roles } from 'common/enums/enums';

export interface UserQueryParams {
  sortBy?: string;
  role?: Roles;
  page?: number;
  search?: string;
  companyId: number;
}
