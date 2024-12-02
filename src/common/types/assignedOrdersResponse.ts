import { Order } from 'common/database/entities/order.entity';
import { User } from 'common/database/entities/user.entity';

export interface AssignedOrdersResponse {
  value: { driver: User; orders: Order[] }[];
  notAssignedOrders: Order[];
}
