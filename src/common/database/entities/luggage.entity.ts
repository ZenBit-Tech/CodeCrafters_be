import { LuggageTypes } from 'common/enums/enums';
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { LuggageImages } from './luggage-imgs.entity';
import { Order } from './order.entity';

@Entity()
export class Luggage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  luggage_type: LuggageTypes;

  @Column({ nullable: false })
  luggage_weight: number;

  @OneToMany(() => LuggageImages, (luggageImg) => luggageImg.luggage, { cascade: true, eager: true })
  imgs: LuggageImages[];

  @ManyToOne(() => Order, (order) => order.luggages)
  order: Order;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  constructor(entity: Partial<Luggage>) {
    Object.assign(this, entity);
  }
}
