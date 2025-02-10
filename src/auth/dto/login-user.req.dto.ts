import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export class LoginReqDto {
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
}

