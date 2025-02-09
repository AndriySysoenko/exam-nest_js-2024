import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class PaginatedResDto<T> {
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
  entities: Partial<T>[];
}
