import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

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

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  constructor(entity: Partial<Customer>) {
    Object.assign(this, entity);
  }
}
