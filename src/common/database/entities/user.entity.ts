import { ApiProperty } from '@nestjs/swagger';
import { Roles } from 'common/enums/enums';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { Company } from './company.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1, description: 'user id' })
  id: number;

  @Column({ nullable: false })
  @ApiProperty({ example: 'John Doe', description: 'user full name' })
  full_name: string;

  @Column({ nullable: false, unique: true })
  @ApiProperty({ example: 'john@gmail.com', description: 'user email' })
  email: string;

  @Column({ nullable: false })
  @ApiProperty({ example: Roles.ADMIN, description: 'user role' })
  role: Roles;

  @Column({ nullable: true })
  @ApiProperty({ example: '+1234567890', description: 'user phone number' })
  phone_number: string;

  @Column({ nullable: true })
  @ApiProperty({ example: '123456', description: 'OTP for driver authentication' })
  otp?: string;

  @Column({ type: 'timestamp', nullable: true })
  @ApiProperty({ example: new Date(), description: 'OTP expiration time' })
  otpExpiry?: Date;

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
