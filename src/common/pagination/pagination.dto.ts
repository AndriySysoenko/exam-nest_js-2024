import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumberString, IsOptional, IsString } from 'class-validator';

export class QueryDto {
  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  page: string;

  @ApiProperty({ required: false, default: 10 })
  @IsOptional()
  limit: string;

  @ApiProperty({ required: false, default: 'ASC', enum: ['ASC', 'DESC'] })
  @IsEnum(['ASC', 'DESC'])
  @IsOptional()
  order = 'ASC';

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumberString()
  sort?: string;
}
