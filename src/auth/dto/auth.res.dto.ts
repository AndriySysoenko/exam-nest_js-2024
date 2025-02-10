import { ApiProperty } from '@nestjs/swagger';
import { UserResDto } from '../../users/dto/user.res.dto';
import { TokenPairDto } from './token-pair.dto';

export class AuthSignUpResponseDto {
  @ApiProperty({ type: UserResDto })
  newUser: UserResDto;

  @ApiProperty({
    example: {
      accessToken: 'jwt_access_token',
      refreshToken: 'jwt_refresh_token',
    },
  })
  tokens: TokenPairDto;
}
