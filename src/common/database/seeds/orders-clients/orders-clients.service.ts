import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from 'common/database/entities/company.entity';
import { Customer } from 'common/database/entities/customer.entity';
import { LuggageImages } from 'common/database/entities/luggage-imgs.entity';
import { Luggage } from 'common/database/entities/luggage.entity';
import { Order } from 'common/database/entities/order.entity';
import { DataSource, Repository } from 'typeorm';

import { companyData, customersData, luggageImgsData, ordersData } from './data';

@Injectable()
export class OrdersClientsService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,
    private readonly dataSource: DataSource,
  ) {}

  async seed(): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      const isCompanyExists: Company | null = await this.companyRepo.findOne({ where: { name: companyData.name } });
      if (isCompanyExists) return;

      const company: Company = this.companyRepo.create(companyData);
      const customers: Customer[] = customersData.map((customerData) => new Customer(customerData));

      const orders: Order[] = ordersData.map((orderData) => {
        const foundedCustomer = customers.find((customer) => customer.full_name === orderData.customer_name);

        const luggages: Luggage[] = orderData.luggages.map(
          (luggage) => new Luggage({ ...luggage, imgs: luggageImgsData.map((imgData) => new LuggageImages(imgData)) }),
        );

        return new Order({
          collection_date: orderData.collection_date,
          collection_time_start: orderData.collection_time_start,
          collection_time_end: orderData.collection_time_end,
          collection_address: orderData.collection_address,
          status: orderData.status,
          customer: foundedCustomer,
          company,
          luggages,
        });
      });

      await queryRunner.startTransaction();
      await queryRunner.manager.save(company);
      await queryRunner.manager.save(customers);
      await queryRunner.manager.save(orders);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
