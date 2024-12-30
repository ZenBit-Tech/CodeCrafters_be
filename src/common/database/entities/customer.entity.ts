import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { CustomerSign } from './customer-sign.entity';
import { Order } from './order.entity';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  full_name: string;

  @Column({ nullable: false })
  phone_number: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false, default: false })
  is_passport_upploaded: boolean;

  @OneToMany(() => Order, (order) => order.customer, { cascade: true })
  orders: Order[];

  @OneToMany(() => CustomerSign, (sign) => sign.customer, { cascade: true, eager: true })
  signs: CustomerSign[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  constructor(entity: Partial<Customer>) {
    Object.assign(this, entity);
  }
}
