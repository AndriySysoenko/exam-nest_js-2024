import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserEntity } from './user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('posts')
export class PostEntity extends BaseEntity {
  @ApiProperty({ description: 'Title of the post' })
  @Column('text', { nullable: false })
  title: string;

  @ApiProperty({ description: 'Body of the post' })
  @Column('text', { nullable: false })
  body: string;

  @ApiProperty({ description: 'Description of the post', required: false })
  @Column('text', { nullable: true })
  description?: string;

  @ApiProperty({ description: 'User ID related to the post' })
  @Column('text', { nullable: false })
  user_id: string;

  @ApiProperty({
    description: 'User who created the post',
    type: () => UserEntity,
    required: false,
  })
  @ManyToOne(() => UserEntity, (entity) => entity.posts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;
}
