import { ApiProperty } from '@nestjs/swagger';

export class TokenPairDto {
  @ApiProperty({ example: 'new_access_token_here' })
  accessToken: string;

  @ApiProperty({ example: 'new_refresh_token_here' })
  refreshToken: string;
}
