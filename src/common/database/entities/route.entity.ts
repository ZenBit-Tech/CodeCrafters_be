import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { Company } from './company.entity';
import { User } from './user.entity';
import { RouteStatuses } from 'common/enums/enums';

@Entity()
export class Route {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  submission_date: Date;

  @Column()
  arrival_date: Date;

  @Column()
  distance: number;

  @Column()
  status: RouteStatuses;

  @ManyToOne(() => User, (user) => user.id, { cascade: true, eager: true })
  @JoinColumn()
  user_id: User;

  @ManyToOne(() => Company, (company) => company.id, { cascade: true, eager: true })
  @JoinColumn()
  company_id: Company;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  constructor(entity: Partial<Route>) {
    Object.assign(this, entity);
  }
}
