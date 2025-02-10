import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Matches,
  Max,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateUserReqDto {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  @Length(3, 20, { message: 'Name must be between 3 and 20 characters' })
  @Transform(({ value }) => value.trim())
  @ApiProperty({
    example: 'John Doe',
    description: 'User name',
    required: true,
  })
  public readonly name: string;

  @IsOptional()
  @IsString({ message: 'nickName must be a string' })
  @Length(3, 20, { message: 'Name must be between 3 and 20 characters' })
  @Transform(({ value }) => value.trim())
  @ApiProperty({
    example: 'JohnDoe',
    description: 'Nickname',
    required: false,
  })
  public readonly nickName?: string;

  @IsEmail()
  @IsNotEmpty({ message: 'Email is required' })
  @IsString()
  @Matches(/^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/)
  @ApiProperty({
    example: 'jD2j2@example.com',
    description: 'User email',
    required: true,
    uniqueItems: true,
  })
  public readonly email: string;

  @IsString()
  @Matches(/^\S*(?=\S{8,})(?=\S*[A-Z])(?=\S*[\d])\S*$/, {
    message: 'Password must have 1 upper case',
  })
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  @ApiProperty({
    example: 'password',
    description: 'User password',
    required: true,
  })
  public readonly password: string;

  @IsNumber()
  @Min(16)
  @Max(99)
  @IsNotEmpty()
  @ApiProperty({
    example: 20,
    description: 'User age',
    required: false,
  })
  public readonly age: number;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'male',
    description: 'User gender',
    required: false,
  })
  public readonly gender?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '+380501234567',
    description: 'Update user phone',
    required: false,
  })
  public readonly phone?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'Kiev',
    description: 'Update user city',
    required: false,
  })
  public readonly city?: string;
}
