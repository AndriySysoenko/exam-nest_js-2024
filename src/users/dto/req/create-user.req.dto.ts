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
  @IsString({ message: 'Name must be a string' })
  @Length(3, 20, { message: 'Name must be between 3 and 20 characters' })
  @Transform(({ value }) => value.trim())
  @ApiProperty({
    example: 'John Doe',
    description: 'User name',
    required: true,
  })
  public readonly name: string;

  @IsEmail()
  @IsNotEmpty({ message: 'Email is required' })
  @IsString()
  // @Transform(({ value }) => value.trim.toLowerCase())
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
  @IsOptional()
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
  public readonly gender: string;
}
