import { OrderStatuses } from 'common/enums/enums';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { Company } from './company.entity';
import { Customer } from './customer.entity';
import { Route } from './route.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  collection_date: Date;

  @Column({ nullable: false })
  status: OrderStatuses;

  @ManyToOne(() => Customer, (customer) => customer.id, { cascade: true, eager: true })
  @JoinColumn()
  customer_id: Customer;

  @ManyToOne(() => Route, (route) => route.id, { cascade: true, eager: true })
  @JoinColumn()
  route_id: Route;

  @ManyToOne(() => Company, (company) => company.id, { cascade: true, eager: true })
  @JoinColumn()
  company_id: Company;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  constructor(entity: Partial<Order>) {
    Object.assign(this, entity);
  }
}
