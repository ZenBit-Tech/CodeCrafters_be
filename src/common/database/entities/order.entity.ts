import { OrderStatuses } from 'common/enums/enums';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { Company } from './company.entity';
import { Customer } from './customer.entity';
import { Luggage } from './luggage.entity';
import { Route } from './route.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  collection_date: Date;

  @Column({ nullable: false })
  collection_time_start: Date;

  @Column({ nullable: false })
  collection_time_end: Date;

  @Column({ nullable: false })
  collection_address: string;

  @Column({ nullable: false })
  status: OrderStatuses;

  @Column({ nullable: false, default: 'John F. Kennedy International Airport' })
  airport_name: string;

  @Column({ nullable: false, default: 'Yss234jJi' })
  flight_id: string;

  @Column({ nullable: false, default: 'files/tickets/image 30.png' })
  ticket_photo: string;

  @ManyToOne(() => Customer, (customer) => customer.id, { cascade: true, eager: true, nullable: false })
  @JoinColumn()
  customer: Customer;

  @ManyToOne(() => Route, (route) => route.orders)
  route: Route | null;

  @ManyToOne(() => Company, (company) => company.id, { cascade: true, eager: true })
  @JoinColumn()
  company: Company;

  @OneToMany(() => Luggage, (luggage) => luggage.order, { cascade: true })
  luggages: Luggage[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  constructor(entity: Partial<Order>) {
    Object.assign(this, entity);
  }
}
