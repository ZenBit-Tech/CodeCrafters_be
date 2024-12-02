import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'common/database/entities/order.entity';
import { User } from 'common/database/entities/user.entity';
import { Repository } from 'typeorm';

export interface RoutesInform {
  value: {
    driver: User;
    orders: Order[];
  }[];
}

@Injectable()
export class AssignOrdersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
  ) {}

  private assignOrdersToDrivers(
    drivers: User[],
    orders: Order[],
  ): { value: { driver: User; orders: Order[] }[]; notAssignedOrders: Order[] } {
    orders.sort((a, b) => new Date(a.collection_time_start).getTime() - new Date(b.collection_time_start).getTime());
    const assignments: { driver: User; orders: Order[] }[] = drivers.map((driver) => ({
      driver,
      orders: [],
    }));
    const notAssignedOrders: Order[] = [];
    const driverCount = drivers.length;
    for (const order of orders) {
      let assigned = false;

      for (let i = 0; i < driverCount; i += 1) {
        const assignment = assignments[i];
        const driverOrders = assignment.orders;

        const hasSameStartTime = driverOrders.some(
          (o) => new Date(o.collection_time_start).getTime() === new Date(order.collection_time_start).getTime(),
        );

        if (!hasSameStartTime) {
          assignment.orders.push(order);
          assigned = true;
          break;
        }
      }

      if (!assigned) {
        notAssignedOrders.push(order);
      }
    }

    return {
      value: assignments,
      notAssignedOrders,
    };
  }

  async getAndAssign(driversIds: number[], ordersIds: number[]): Promise<RoutesInform> {
    try {
      const getOdersQuery = this.orderRepo
        .createQueryBuilder('order')
        .where('order.id IN (:...ids)', { ids: ordersIds })
        .orderBy('order.collection_date', 'ASC');
      const getDriversQuery = this.userRepo.createQueryBuilder('user').where('user.id IN (:...ids)', { ids: driversIds });
      const orders = await getOdersQuery.getMany();
      const drivers = await getDriversQuery.getMany();

      return this.assignOrdersToDrivers(drivers, orders);
    } catch (error) {
      throw new InternalServerErrorException('something went wrong');
    }
  }
}
