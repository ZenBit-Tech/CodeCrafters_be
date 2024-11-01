import { Injectable, InternalServerErrorException } from '@nestjs/common';
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
      const isCompanyExists = await this.companyRepo.findOne({ where: { name: companyData.name } });
      if (isCompanyExists) return;

      const company = this.companyRepo.create(companyData);
      const customers = customersData.map((customerData) => new Customer(customerData));

      const orders = ordersData.map((orderData) => {
        const customer = customers.find((cust) => cust.full_name === orderData.customer_name);
        if (!customer) throw new InternalServerErrorException(`Order must have a valid customer`);

        const luggages = orderData.luggages.map(
          (luggage) => new Luggage({ ...luggage, imgs: luggageImgsData.map((imgData) => new LuggageImages(imgData)) }),
        );

        return new Order({
          collection_date: orderData.collection_date,
          status: orderData.status,
          customer_id: customer,
          company_id: company,
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
