import { ApiProperty } from '@nestjs/swagger';
import { Roles } from 'common/enums/enums';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { Company } from './company.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1, description: 'user id' })
  id: number;

  @Column({ default: '' })
  @ApiProperty({ example: 'http://logo', description: 'user logo' })
  logo: string;

  @Column({ nullable: false })
  @ApiProperty({ example: 'John Doe', description: 'user full name' })
  full_name: string;

  @Column({ nullable: false, unique: true })
  @ApiProperty({ example: 'john@gmail.com', description: 'user email' })
  email: string;

  @Column({ nullable: false })
  @ApiProperty({ example: Roles.ADMIN, description: 'user role' })
  role: Roles;

  @ManyToOne(() => Company, (company) => company.id, { cascade: true, eager: true })
  @JoinColumn()
  @ApiProperty({ example: Company, description: 'user company' })
  company_id: Company;

  @CreateDateColumn({ type: 'timestamp' })
  @ApiProperty({ example: new Date(), description: 'user created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  @ApiProperty({ example: new Date(), description: 'user updated_at' })
  updatedAt: Date;

  constructor(entity: Partial<User>) {
    Object.assign(this, entity);
  }
}
