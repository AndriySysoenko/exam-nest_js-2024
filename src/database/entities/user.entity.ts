import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('user')
export class UserEntity extends BaseEntity {
  @Column('text', { nullable: true })
  name: string;

  @Column('text', { nullable: true })
  nickName?: string;

  @Column('text', { nullable: false, unique: true })
  email: string;

  @Column('text', { nullable: false })
  password: string;

  @Column('integer', { nullable: true })
  age?: number;

  @Column({ default: false })
  isActive?: boolean;

  @Column({ default: 'User' })
  role?: string;
}
