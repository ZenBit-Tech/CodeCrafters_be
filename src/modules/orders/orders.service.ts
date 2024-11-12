import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ORDER_PAGE_LENGTH } from 'common/constants/numbers';
import { Order } from 'common/database/entities/order.entity';
import { FindManyOptions, Repository } from 'typeorm';

import { OrderQueryParams } from './types';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async findAll({ sortBy, filterBy, page, companyId }: OrderQueryParams): Promise<{ orders: Order[]; page: number; pagesCount: number }> {
    const findSettings: FindManyOptions<Order> = {
      order: { ...(<Record<string, string>>JSON.parse(sortBy)) },
      skip: (page - 1) * ORDER_PAGE_LENGTH,
      take: ORDER_PAGE_LENGTH,
      relations: ['luggages'],
      where: {
        status: filterBy,
        company: { id: companyId },
      },
    };

    try {
      const orders = await this.orderRepository.find({ ...findSettings });
      const ordersCount = await this.orderRepository.count({ ...findSettings });

      return { orders, page: +page, pagesCount: Math.ceil(ordersCount / 10) };
    } catch (error) {
      throw new InternalServerErrorException('Internal server error');
    }
  }
}
