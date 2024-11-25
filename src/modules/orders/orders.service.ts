import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ORDER_PAGE_LENGTH } from 'common/constants/numbers';
import { Order } from 'common/database/entities/order.entity';
import { LuggageTypes, OrderStatuses } from 'common/enums/enums';
import { FindManyOptions, IsNull, Like, Between, Not, Repository } from 'typeorm';

import { OrderServiceParams } from './types';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async findAll({
    sortBy,
    filterBy,
    page,
    companyId,
    search,
    isNew,
  }: OrderServiceParams): Promise<{ orders: Order[]; page: number; pagesCount: number }> {
    const findSettings: FindManyOptions<Order> = {
      skip: (page - 1) * ORDER_PAGE_LENGTH,
      take: ORDER_PAGE_LENGTH,
      relations: ['luggages'],
      where: search
        ? [
            {
              status: OrderStatuses[filterBy],
              company: { id: companyId },
              route: isNew ? IsNull() : {},
              customer: {
                full_name: Like(`%${search}%`),
              },
            },
            {
              status: OrderStatuses[filterBy],
              company: { id: companyId },
              collection_address: Like(`%${search}%`),
              route: isNew ? IsNull() : {},
            },
            {
              status: OrderStatuses[filterBy],
              company: { id: companyId },
              luggages: {
                luggage_type: <LuggageTypes>(<unknown>Like(`%${search}%`)),
              },
              route: isNew ? IsNull() : {},
            },
            {
              status: OrderStatuses[filterBy],
              company: { id: companyId },
              customer: {
                phone_number: <LuggageTypes>(<unknown>Like(`%${search}%`)),
              },
              route: isNew ? IsNull() : {},
            },
            {
              status: OrderStatuses[filterBy],
              company: { id: companyId },
              customer: {
                email: <LuggageTypes>(<unknown>Like(`%${search}%`)),
              },
              route: isNew ? IsNull() : {},
            },
            {
              status: OrderStatuses[filterBy],
              company: { id: companyId },
              route: {
                id: <number>(<unknown>Like(`%${search}%`)),
              },
            },
            {
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
        : { status: OrderStatuses[filterBy], company: { id: companyId }, route: isNew ? IsNull() : {} },
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
    } catch (error) {
      console.error('Error fetching dates:', error);
      throw new InternalServerErrorException('Failed to fetch dates');
    }
  }
}
