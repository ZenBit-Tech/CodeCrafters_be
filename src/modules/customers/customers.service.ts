import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from 'common/database/entities/customer.entity';
import { Order } from 'common/database/entities/order.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
  ) {}

  async findOne(orderId: number): Promise<Customer> {
    try {
      return await this.customerRepo.findOneOrFail({ where: { orders: { id: orderId } } });
    } catch (error) {
      throw new NotFoundException('Customer not found');
    }
  }

  async verifyTicket(customerId: number, orderId: number): Promise<boolean> {
    try {
      const order = await this.orderRepo.findOneOrFail({ where: { id: orderId }, relations: ['customer'] });

      return order.customer.id === customerId;
    } catch (error) {
      throw new NotFoundException('not found');
    }
  }
}
