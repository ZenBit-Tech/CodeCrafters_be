import { Roles } from 'common/enums/enums';

export interface SuperAdminInterface {
  logo: string;
  full_name: string;
  email: string;
  role: Roles.SUPERADMIN;
}

export const SuperAdminData: SuperAdminInterface = {
  logo: '',
  full_name: 'Super Admin',
  email: 'superadmin@gmail.com',
  role: Roles.SUPERADMIN,
};
