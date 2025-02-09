import { Expose, Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PostResDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @Length(10, 100)
  @Transform(({ value }) => value?.trim() ?? '')
  @ApiProperty({ required: true })
  public readonly id: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim() ?? '')
  @ApiProperty({ required: true })
  public readonly user_id: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @Length(10, 100)
  @Transform(({ value }) => value?.trim() ?? '')
  @Type(() => String)
  @ApiProperty({ required: true })
  public readonly title: string;

  @Expose()
  @IsString()
  @IsOptional()
  @Length(0, 300)
  @Transform(({ value }) => value?.trim() ?? '')
  @Type(() => String)
  @ApiProperty({ required: false })
  public readonly description?: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @Length(0, 3000)
  @Transform(({ value }) => value?.trim() ?? '')
  @Type(() => String)
  @ApiProperty({ required: true })
  public readonly body: string;

  @Expose()
  @Transform(({ value }) => new Date(value))
  @ApiProperty({ required: true })
  public readonly createdAt: Date;

  @Expose()
  @Transform(({ value }) => new Date(value))
  @ApiProperty({ required: true })
  public readonly updatedAt: Date;
}
