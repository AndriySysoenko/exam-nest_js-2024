import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../../database/entities/user.entity';
import { IsArray } from 'class-validator';

export class PaginatedResDto {
  @ApiProperty({ type: 'number' })
  page: number;

  @ApiProperty({ type: 'number' })
  pages: number;

  @ApiProperty({ type: 'number' })
  limit: number;

  @ApiProperty({ type: 'number' })
  total: number;

  @IsArray()
  @ApiProperty({ type: 'array', items: { type: 'object' } })
  entities: Partial<UserEntity>[];
}
