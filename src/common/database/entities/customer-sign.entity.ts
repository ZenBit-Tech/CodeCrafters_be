import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { Customer } from './customer.entity';

@Entity()
export class CustomerSign {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  path: string;

  @ManyToOne(() => Customer, (customer) => customer.signs)
  customer: Customer;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  constructor(entity: Partial<CustomerSign>) {
    Object.assign(this, entity);
  }
}
