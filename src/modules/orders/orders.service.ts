import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { FindManyOptions, Like, MoreThanOrEqual, Repository, IsNull } from 'typeorm';
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
      const orders = await this.orderRepository.find({
        where: { collection_date: MoreThanOrEqual(date), company: { id: companyId } },
      });

      console.log(orders);

      const datesByOrders: Record<string, number> = {};

      // for (const key in orders) {
      //   const order = orders[key];

      //   if (!order.route) continue;

      //   if (datesByOrders[order.collection_date.toISOString().split('T')[0]]) {
      //     datesByOrders[order.collection_date.toISOString().split('T')[0]] += 1;
      //   } else {
      //     datesByOrders[order.collection_date.toISOString().split('T')[0]] = 1;
      //   }
      // }

      return datesByOrders;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
