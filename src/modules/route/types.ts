export interface RouteData {
  route_id: number;
  route_submission_date: string;
  route_arrival_date: string;
  route_status: string;
  route_distance: number;
  route_companyIdId: number;
  route_userIdId: number;
  ordersCount: string;

  company_id: number;
  company_name: string;
  company_email: string;
  company_logo: string;
  company_createdAt: string;
  company_updatedAt: string;
  company_client_name: string;

  user_id: number;
  user_full_name: string;
  user_email: string;
  user_logo: string;
  user_phone_number: string | null;
  user_role: string;
  user_createdAt: string;
  user_updatedAt: string;
}

export interface FilterData {
  driver: string;
  stopsCount: number;
  status: string;
}
