import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Company {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1, description: 'unique id' })
  id: number;

  @Column({ nullable: false })
  @ApiProperty({ example: 'Starbulka', description: 'company name' })
  name: string;

  @Column({ default: '' })
  @ApiProperty({ example: 'https://company-logo-link', description: 'link to company logo' })
  logo: string;

  @Column({ nullable: false, unique: true })
  @ApiProperty({ example: 'company@text.mail', description: 'link to company logo' })
  email: string;

  @CreateDateColumn({ type: 'timestamp' })
  @ApiProperty({ example: '2024-10-25T03:50:01.112Z', description: 'Created at time' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  @ApiProperty({ example: '2024-10-25T03:50:01.112Z', description: 'Updated at time' })
  updatedAt: Date;

  constructor(entity: Partial<Company>) {
    Object.assign(this, entity);
  }
}
