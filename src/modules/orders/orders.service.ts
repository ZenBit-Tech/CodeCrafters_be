import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ORDER_PAGE_LENGTH } from 'common/constants/numbers';
import { Order } from 'common/database/entities/order.entity';
import { User } from 'common/database/entities/user.entity';
import { LuggageTypes, OrderStatuses } from 'common/enums/enums';
import { AssignedOrdersResponse } from 'common/types/assignedOrdersResponse';
import { FindManyOptions, IsNull, Like, Between, Not, Repository } from 'typeorm';

import { OrderServiceParams } from './types';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async findAll({
    sortBy,
    filterBy,
    page,
    companyId,
    search,
    isNew,
    startDate,
  }: OrderServiceParams): Promise<{ orders: Order[]; page: number; pagesCount: number }> {
    let dateFromServer;
    let startOfDay;
    let endOfDay;

    if (startDate) {
      dateFromServer = new Date(startDate);
      startOfDay = new Date(dateFromServer.getFullYear(), dateFromServer.getMonth(), dateFromServer.getDate());
      endOfDay = new Date(dateFromServer.getFullYear(), dateFromServer.getMonth(), dateFromServer.getDate(), 23, 59, 59, 999);
    }

    const collectionDateCondition = {
      collection_date: startDate ? Between(startOfDay, endOfDay) : Not(IsNull()),
    };

    const findSettings: FindManyOptions<Order> = {
      skip: (page - 1) * ORDER_PAGE_LENGTH,
      take: ORDER_PAGE_LENGTH,
      relations: ['luggages', 'route'],
      where: search
        ? [
            {
              ...collectionDateCondition,
              status: OrderStatuses[filterBy],
              company: { id: companyId },
              route: isNew ? IsNull() : {},
              customer: {
                full_name: Like(`%${search}%`),
              },
            },
            {
              ...collectionDateCondition,
              status: OrderStatuses[filterBy],
              company: { id: companyId },
              collection_address: Like(`%${search}%`),
              route: isNew ? IsNull() : {},
            },
            {
              ...collectionDateCondition,
              status: OrderStatuses[filterBy],
              company: { id: companyId },
              luggages: {
                luggage_type: <LuggageTypes>(<unknown>Like(`%${search}%`)),
              },
              route: isNew ? IsNull() : {},
            },
            {
              ...collectionDateCondition,
              status: OrderStatuses[filterBy],
              company: { id: companyId },
              customer: {
                phone_number: <LuggageTypes>(<unknown>Like(`%${search}%`)),
              },
              route: isNew ? IsNull() : {},
            },
            {
              ...collectionDateCondition,
              status: OrderStatuses[filterBy],
              company: { id: companyId },
              customer: {
                email: <LuggageTypes>(<unknown>Like(`%${search}%`)),
              },
              route: isNew ? IsNull() : {},
            },
            {
              ...collectionDateCondition,
              status: OrderStatuses[filterBy],
              company: { id: companyId },
              route: {
                id: <number>(<unknown>Like(`%${search}%`)),
              },
            },
            {
              ...collectionDateCondition,
              status: OrderStatuses[filterBy],
              company: { id: companyId },
              route: {
                id: <number>(<unknown>Like(`%${search}%`)),
              },
            },
            {
              status: OrderStatuses[filterBy],
              company: { id: companyId },
              collection_date: <Date>(<unknown>Like(`%${search}%`)),
              route: isNew ? IsNull() : {},
            },
          ]
        : {
            ...collectionDateCondition,
            status: OrderStatuses[filterBy],
            company: { id: companyId },
            route: isNew ? IsNull() : {},
          },
      order: { ...(<Record<string, string>>JSON.parse(sortBy)) },
    };

    try {
      const orders = await this.orderRepository.find({ ...findSettings });
      const ordersCount = await this.orderRepository.count({ ...findSettings });

      return { orders, page: +page, pagesCount: Math.ceil(ordersCount / 10) };
    } catch (error) {
      throw new InternalServerErrorException('Internal server error');
    }
  }

  async getDates(date: Date, companyId: number): Promise<Record<string, number>> {
    try {
      let dateStart: Date = new Date(date);
      const dateEnd: Date = new Date(date);
      if (dateStart.getMonth() <= new Date().getMonth() && dateStart.getDate() <= 30) {
        dateStart = new Date();
        dateStart.setDate(dateStart.getDate() - 1);
        dateEnd.setMonth(dateEnd.getMonth() === 12 ? 1 : dateEnd.getMonth() + 1);
      } else {
        if (dateEnd.getMonth() === 12) {
          dateEnd.setFullYear(dateEnd.getFullYear() + 1);
          dateEnd.setMonth(1);
        } else {
          dateEnd.setMonth(dateEnd.getMonth() + 1);
        }
        dateEnd.setDate(6);
        dateStart.setDate(dateStart.getDate() - 6);
      }

      const orders = await this.orderRepository.find({
        where: {
          collection_date: Between(dateStart, dateEnd),
          company: { id: companyId },
          route: Not(IsNull()),
        },
      });

      return orders.reduce<Record<string, number>>((acc, order) => {
        const collectionDateKey = order.collection_date.toISOString().split('T')[0];
        acc[collectionDateKey] = (acc[collectionDateKey] || 0) + 1;
        return acc;
      }, {});
    } catch (error: unknown) {
      throw new InternalServerErrorException(error);
    }
  }

  private assignOrdersToDrivers(drivers: User[], orders: Order[]): AssignedOrdersResponse {
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

  async getAndAssign(driversIds: number[], ordersIds: number[]): Promise<AssignedOrdersResponse> {
    try {
      const getOdersQuery = this.orderRepository
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
