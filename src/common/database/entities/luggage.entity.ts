import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { Order } from './order.entity';
import { LuggageTypes } from 'common/enums/enums';

@Entity()
export class Luggage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  luggage_type: LuggageTypes;

  @Column()
  luggage_weight: number;

  @ManyToOne(() => Order, (order) => order.id, { cascade: true, eager: true })
  @JoinColumn()
  order_id: Order;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  constructor(entity: Partial<Luggage>) {
    Object.assign(this, entity);
  }
}
