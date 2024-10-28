import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class LuggageImages {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  link: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  constructor(entity: Partial<LuggageImages>) {
    Object.assign(this, entity);
  }
}
