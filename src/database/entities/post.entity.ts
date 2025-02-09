import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserEntity } from './user.entity';

@Entity('posts')
export class PostEntity extends BaseEntity {
  @Column('text', { nullable: false })
  title: string;

  @Column('text', { nullable: false })
  body?: string;

  @Column('text', { nullable: true })
  description?: string;

  @Column('text', { nullable: false })
  user_id: string;

  @ManyToOne(() => UserEntity, (entity) => entity.posts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;
}
