import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { User } from './user.entity';
import { NotificationTypes } from 'common/enums/enums';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: NotificationTypes;

  @Column()
  is_readed: boolean;

  @Column()
  link_text: string;

  @Column()
  link_href: string;

  @Column()
  message: string;

  @Column()
  created_at: Date;

  @ManyToOne(() => User, (user) => user.id, { cascade: true, eager: true })
  @JoinColumn()
  user_id: User;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  constructor(entity: Partial<Notification>) {
    Object.assign(this, entity);
  }
}
