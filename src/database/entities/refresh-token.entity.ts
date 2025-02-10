import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { BaseEntity } from './base.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('refresh_tokens')
export class RefreshTokenEntity extends BaseEntity {
  @ApiProperty({ description: 'User ID associated with the refresh token' })
  @Column('text')
  userId: string;

  @ApiProperty({ description: 'The refresh token string' })
  @Column('text')
  token: string;

  @ApiProperty({
    description: 'User related to the refresh token',
    type: () => UserEntity,
    required: false,
  })
  @OneToOne(() => UserEntity, (entity) => entity.refreshToken, {
    cascade: ['remove'],
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user?: UserEntity;
}
