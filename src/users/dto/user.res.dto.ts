import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

export class UserResDto {
  @ApiProperty({ required: true })
  @Expose()
  public readonly id: string;

  @ApiProperty({
    required: true,
  })
  @Expose()
  public readonly name: string;

  @ApiProperty({
    required: true,
    uniqueItems: true,
  })
  @Expose()
  public readonly email: string;

  @ApiProperty({
    required: true,
  })
  @Expose()
  @Transform(({ value }) => new Date(value))
  public readonly createdAt: Date;

  @ApiProperty()
  @Expose()
  public readonly age?: number;
}
