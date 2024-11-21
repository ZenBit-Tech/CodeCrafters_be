import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { FindManyOptions, IsNull, Like, Between, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ORDER_PAGE_LENGTH } from 'common/constants/numbers';
import { Order } from 'common/database/entities/order.entity';
import { LuggageTypes, OrderStatuses } from 'common/enums/enums';

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
      const datePlus30 = new Date(date);
      datePlus30.setMonth(datePlus30.getMonth() === 12 ? 1 : datePlus30.getMonth() + 1);

      const orders = await this.orderRepository.find({
        where: {
          collection_date: Between(date, datePlus30),
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
