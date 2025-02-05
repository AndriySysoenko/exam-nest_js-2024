import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

export class UserResDto {
  @ApiProperty()
  public readonly id: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'User name',
    required: true,
  })
  @Expose()
  public readonly name: string;

  @ApiProperty({
    example: 'jD2j2@example.com',
    description: 'User email',
    required: true,
    uniqueItems: true,
  })
  @Expose()
  public readonly email: string;

  @ApiProperty({
    example: 'jD2j2@example.com',
    description: 'User email',
    required: true,
    uniqueItems: true,
  })
  @Expose()
  @Transform(({ value }) => new Date(value))
  public readonly createdAt: Date;

  // @ApiProperty({
  //   example: 'password',
  //   description: 'User password',
  //   required: true,
  // })
  // public readonly password: string;

  // @ApiProperty({
  //   example: 20,
  //   description: 'User age',
  //   required: false,
  // })
  // public readonly age: number;
  //
  // @ApiProperty({
  //   example: 'male',
  //   description: 'User gender',
  //   required: false,
  // })
  // public readonly gender: string;
}
