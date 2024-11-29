import { RouteStatuses } from 'common/enums/enums';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { Company } from './company.entity';
import { Order } from './order.entity';
import { User } from './user.entity';

@Entity()
export class Route {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  submission_date: Date;

  @Column({ nullable: false })
  arrival_date: Date;

  @Column({ nullable: false })
  distance: number;

  @Column({ nullable: false })
  status: RouteStatuses;

  @ManyToOne(() => User, (user) => user.id, { cascade: true, eager: true })
  @JoinColumn()
  user_id: User;

  @ManyToOne(() => Company, (company) => company.id, { cascade: true, eager: true })
  @JoinColumn()
  company_id: Company;

  @OneToMany(() => Order, (order) => order.route, { cascade: true })
  orders: Order[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  constructor(entity: Partial<Route>) {
    Object.assign(this, entity);
  }
}
