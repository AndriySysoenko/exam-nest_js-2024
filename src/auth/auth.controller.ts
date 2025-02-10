import {
  Controller,
  Post,
  Body,
  Delete,
  Req,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreateUserReqDto } from '../users/dto/create-user.req.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from '../database/entities/user.entity';
import { AuthSignUpResponseDto } from './dto/auth.res.dto';
import { RefreshTokenDto } from './dto/refresh-token.req.dto';
import { TokenPairDto } from './dto/token-pair.dto';
import { LoginReqDto } from './dto/login-user.req.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'New authorized users are created ' })
  @ApiOkResponse({ type: AuthSignUpResponseDto })
  @Post('/signup')
  async signUp(
    @Body() dataAuthDto: CreateUserReqDto,
  ): Promise<AuthSignUpResponseDto> {
    return this.authService.signUp(dataAuthDto);
  }

  @ApiOperation({ summary: 'Starting a new session. Login' })
  @ApiBody({ type: LoginReqDto })
  @ApiOkResponse({ type: TokenPairDto })
  @ApiNotFoundResponse({ description: 'Not found' })
  @Post('/login')
  public async login(@Body() loginDto: LoginReqDto): Promise<TokenPairDto> {
    return this.authService.login(loginDto);
  }

  @ApiOperation({ summary: 'Refresh token pair' })
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Refresh token not found' })
  @UseGuards(AuthGuard('jwt'))
  @ApiBody({ type: RefreshTokenDto })
  @ApiOkResponse({ type: TokenPairDto })
  @Post('refresh')
  async refresh(@Body() body: RefreshTokenDto): Promise<TokenPairDto> {
    if (!body.refreshToken) {
      throw new UnauthorizedException('Refresh token is required.');
    }
    return this.authService.refreshToken(body);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'End session. Logout' })
  @ApiOkResponse({
    schema: { example: { message: 'Logged out successfully' } },
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(AuthGuard('jwt'))
  @Delete('/logout')
  public async logout(@Req() req: { user: UserEntity }) {
    await this.authService.logout(req.user.id);
    return { message: 'Logged out successfully' };
  }
}
