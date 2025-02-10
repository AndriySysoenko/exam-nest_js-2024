import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Exclude } from 'class-transformer';
import { PostEntity } from './post.entity';
import { RefreshTokenEntity } from './refresh-token.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('user')
export class UserEntity extends BaseEntity {
  @ApiProperty({ example: 'John Doe', nullable: false })
  @Column('text', { nullable: false })
  name: string;

  @ApiProperty({ example: 'johnDoe', nullable: true })
  @Column('text', { nullable: true })
  nickName?: string;

  @ApiProperty({ example: 'johndoe@example.com' })
  @Column('text', { nullable: false, unique: true })
  email: string;

  @Column('text', { nullable: false })
  @Exclude()
  password: string;

  @ApiProperty({ example: 25, nullable: true })
  @Column('integer', { nullable: true })
  age?: number;

  @ApiProperty({ example: '+380501234567', nullable: true })
  @Column('text', { nullable: true })
  phone?: string;

  @ApiProperty({ example: 'Kyiv', nullable: true, default: 'Kyiv' })
  @Column('text', { nullable: true, default: 'Kyiv' })
  city?: string;

  @ApiProperty({ example: 'male', nullable: true })
  @Column('text', { nullable: true })
  gender?: string;

  @ApiProperty({ example: true })
  @Column({ default: true })
  isActive?: boolean;

  @ApiProperty({ example: 'User' })
  @Column({ default: 'User' })
  role?: string;

  @ApiProperty({ type: () => [PostEntity], required: false })
  @OneToMany(() => PostEntity, (entity) => entity.user)
  posts?: PostEntity[];

  @ApiProperty({ type: () => RefreshTokenEntity, required: false })
  @OneToOne(() => RefreshTokenEntity, (entity) => entity.user)
  @JoinColumn()
  refreshToken?: RefreshTokenEntity;
}
