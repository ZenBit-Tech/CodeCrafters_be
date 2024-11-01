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

  async seed() {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      // create company
      const isCompanyExists = await queryRunner.manager.findOne(Company, { where: { name: companyData.name } });

      if (isCompanyExists) return;

      const company: Company = this.companyRepo.create(companyData);
      await queryRunner.manager.save(company);

      // create customers
      const customers: Customer[] = customersData.map((customer) => new Customer(customer));
      await queryRunner.manager.save(customers);

      // create orders
      const orders: Order[] = ordersData.map((order) => {
        const currentCustomer: Customer | undefined = customers.find((customer) => customer.full_name === order.customer_name);

        if (!currentCustomer) throw new InternalServerErrorException('order should have a customer');

        return new Order({
          collection_date: order.collection_date,
          status: order.status,
          customer_id: currentCustomer,
          company_id: company,
          luggages: order.luggages.map(
            (luggage) => new Luggage({ ...luggage, imgs: luggageImgsData.map((img) => new LuggageImages(img)) }),
          ),
        });
      });

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
