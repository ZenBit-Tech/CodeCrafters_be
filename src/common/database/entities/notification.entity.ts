import { NotificationTypes } from 'common/enums/enums';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { User } from './user.entity';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  type: NotificationTypes;

  @Column({ default: false })
  is_readed: boolean;

  @Column({ nullable: false })
  link_text: string;

  @Column({ nullable: false })
  link_href: string;

  @Column({ nullable: false })
  message: string;

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
