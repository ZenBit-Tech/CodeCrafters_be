import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'common/database/entities/order.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async findAll(): Promise<Order[]> {
    try {
      return await this.orderRepository.find({ relations: ['luggages'] });
    } catch (error) {
      throw new InternalServerErrorException('Internal server error');
    }
  }
}
