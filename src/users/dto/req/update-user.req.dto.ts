import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserReqDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'User name',
    required: true,
  })
  public readonly name?: string;

  @ApiProperty({
    example: 20,
    description: 'User age',
    required: false,
  })
  public readonly age?: number;

  @ApiProperty({
    example: 'male',
    description: 'User gender',
    required: false,
  })
  public readonly gender?: string;
}
