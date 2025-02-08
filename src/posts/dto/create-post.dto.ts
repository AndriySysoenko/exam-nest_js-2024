import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 50)
  @Transform(({ value }) => value.trim())
  @Type(() => String)
  @ApiProperty({ required: true })
  title: string;

  @IsString()
  @IsOptional()
  @Length(0, 300)
  @Transform(({ value }) => value.trim())
  @Type(() => String)
  @ApiProperty({ required: false })
  description?: string;

  @IsString()
  @IsNotEmpty()
  @Length(0, 3000)
  @Transform(({ value }) => value.trim())
  @Type(() => String)
  @ApiProperty({ required: true })
  body: string;
}
