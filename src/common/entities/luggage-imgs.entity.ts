import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { Luggage } from './luggage.entity';

@Entity()
export class LuggageImages {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  link: string;

  @ManyToOne(() => Luggage, (luggage) => luggage.id, { cascade: true, eager: true })
  @JoinColumn()
  luggage_id: Luggage;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  constructor(entity: Partial<LuggageImages>) {
    Object.assign(this, entity);
  }
}
