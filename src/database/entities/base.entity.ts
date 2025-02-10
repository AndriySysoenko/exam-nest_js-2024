import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export class BaseEntity {
  @ApiProperty({ description: 'Unique identifier of the entity' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'The date and time when the entity was created' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'The date and time when the entity was last updated',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
