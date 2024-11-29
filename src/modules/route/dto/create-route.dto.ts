import { Company } from 'common/database/entities/company.entity';
import { User } from 'common/database/entities/user.entity';
import { RouteStatuses } from 'common/enums/enums';

export class CreateRouteDto {
  submission_date: Date;
  arrival_date: Date;
  distance: number;
  status: RouteStatuses;
  user_id: User;
  company_id: Company;
}
