import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { Luggage } from './luggage.entity';

@Entity()
export class LuggageImages {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  link: string;

  @ManyToOne(() => Luggage, (luggage) => luggage.imgs)
  luggage: Luggage;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  constructor(entity: Partial<LuggageImages>) {
    Object.assign(this, entity);
  }
}
