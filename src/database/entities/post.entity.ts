import {
  Column,
  Entity,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserEntity } from './user.entity';

@Entity('posts')
export class PostEntity extends BaseEntity {
  @Column('text')
  title: string;

  @Column('text', { nullable: true })
  body?: string;

  @Column()
  user_id: string;

  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;
}
