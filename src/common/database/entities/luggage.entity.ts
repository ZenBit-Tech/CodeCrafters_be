import { LuggageTypes } from 'common/enums/enums';
import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { LuggageImages } from './luggage-imgs.entity';

@Entity()
export class Luggage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  luggage_type: LuggageTypes;

  @Column({ nullable: false })
  luggage_weight: number;

  @OneToMany(() => LuggageImages, (luggageImgs) => luggageImgs.id, { cascade: true, eager: true })
  @JoinColumn()
  imgs: LuggageImages[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  constructor(entity: Partial<Luggage>) {
    Object.assign(this, entity);
  }
}
