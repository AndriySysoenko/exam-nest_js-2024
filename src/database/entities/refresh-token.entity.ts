import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { BaseEntity } from './base.entity';

@Entity('refresh_tokens')
export class RefreshTokenEntity extends BaseEntity {
  @Column('text')
  userId: string;

  @Column('text')
  token: string;

  @OneToOne(() => UserEntity, (entity) => entity.refreshToken)
  @JoinColumn({ name: 'userId' })
  user?: UserEntity;
}
