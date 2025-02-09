import { ApiProperty } from '@nestjs/swagger';
import {
  IsBooleanString,
  IsEnum,
  IsISO8601,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class QueryDto {
  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  page?: string;

  @ApiProperty({ required: false, default: 10 })
  @IsOptional()
  limit?: string;

  @ApiProperty({ required: false, default: 'ASC', enum: ['ASC', 'DESC'] })
  @IsEnum(['ASC', 'DESC'])
  @IsOptional()
  order?: string = 'ASC';

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  sort?: string;

  @ApiProperty({ required: false, description: 'Filter by isActive status' })
  @IsBooleanString()
  @IsOptional()
  isActive?: string;

  @ApiProperty({ required: false, description: 'Filter by age' })
  @IsNumberString()
  @IsOptional()
  age?: string;

  @ApiProperty({ required: false, description: 'Filter by gender' })
  @IsString()
  @IsOptional()
  gender?: string;

  @ApiProperty({ required: false, description: 'Filter by role' })
  @IsString()
  @IsOptional()
  role?: string;

  @ApiProperty({ required: false, description: 'Filter by created user' })
  @IsISO8601()
  @IsOptional()
  createdAt?: string;

  @ApiProperty({ required: false, description: 'Filter by updated user' })
  @IsString()
  @IsOptional()
  updatedAt?: Date;
}

export class PostQueryDto {
  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  page?: string;

  @ApiProperty({ required: false, default: 10 })
  @IsOptional()
  limit?: string;

  @ApiProperty({ required: false, default: 'ASC', enum: ['ASC', 'DESC'] })
  @IsEnum(['ASC', 'DESC'])
  @IsOptional()
  order?: string = 'ASC';
}
