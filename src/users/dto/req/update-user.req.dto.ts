import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Matches,
  Max,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateUserReqDto {
  @IsString()
  @IsOptional()
  @Length(3, 20, { message: 'Name must be between 3 and 20 characters' })
  @Transform(({ value }) => value.trim())
  @ApiProperty({
    example: 'John',
    description: 'Update user name',
    required: true,
  })
  public readonly name?: string;

  @IsString()
  @IsOptional()
  @Matches(/^\S*(?=\S{8,})(?=\S*[A-Z])(?=\S*[\d])\S*$/, {
    message: 'Password must have 1 upper case',
  })
  @Transform(({ value }) => value.trim())
  @ApiProperty({
    example: 'password',
    description: 'Update user password',
    required: true,
  })
  public readonly password?: string;

  @IsString()
  @IsOptional()
  @Length(3, 20, { message: 'Name must be between 3 and 20 characters' })
  @Transform(({ value }) => value.trim())
  @ApiProperty({
    example: 'Mango',
    description: 'Update user nickName',
    required: true,
  })
  public readonly nickName?: string;

  @IsNumber()
  @Min(16)
  @Max(99)
  @IsOptional()
  @ApiProperty({
    example: 20,
    description: 'Update user age',
    required: false,
  })
  public readonly age?: number;

  @ApiProperty({
    example: '+380501234567',
    description: 'Update user phone',
    required: false,
  })
  public readonly phone?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'male',
    description: 'Update user gender',
    required: false,
  })
  public readonly gender?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'Kiev',
    description: 'Update user city',
    required: false,
  })
  public readonly city?: string;
}
