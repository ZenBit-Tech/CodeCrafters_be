import { Roles } from 'common/enums/enums';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { Company } from './company.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  logo: string;

  @Column()
  full_name: string;

  @Column()
  email: string;

  @Column()
  role: Roles;

  @ManyToOne(() => Company, (company) => company.id, { cascade: true, eager: true })
  @JoinColumn()
  company_id: Company;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  constructor(entity: Partial<User>) {
    Object.assign(this, entity);
  }
}
