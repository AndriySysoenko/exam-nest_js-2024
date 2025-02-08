import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Exclude } from 'class-transformer';
import { PostEntity } from './post.entity';

@Entity('user')
export class UserEntity extends BaseEntity {
  @Column('text', { nullable: true })
  name: string;

  @Column('text', { nullable: true })
  nickName?: string;

  @Column('text', { nullable: false, unique: true })
  email: string;

  @Column('text', { nullable: false })
  @Exclude()
  password: string;

  @Column('integer', { nullable: true })
  age?: number;

  @Column('text', { nullable: true })
  phone?: string;

  @Column('text', { nullable: true, default: 'Kyiv' })
  city?: string;

  @Column('text', { nullable: true })
  gender?: string;

  @Column({ default: true })
  isActive?: boolean;

  @Column({ default: 'User' })
  role?: string;

  @OneToMany(() => PostEntity, (entity) => entity.user)
  posts?: PostEntity[];
}
