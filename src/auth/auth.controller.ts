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
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  CreateUserReqDto,
  LoginReqDto,
} from '../users/dto/req/create-user.req.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserResDto } from '../users/dto/res/user.res.dto';
import { UserEntity } from '../database/entities/user.entity';
import { ITokenPair } from '../common/interfaces/ITokenPair';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Sign up' })
  @ApiOkResponse({ type: UserResDto })
  @Post('/signup')
  async signUp(
    @Body() dataAuthDto: CreateUserReqDto,
  ): Promise<{ newUser: UserResDto; tokens: ITokenPair }> {
    return this.authService.signUp(dataAuthDto);
  }

  @ApiOperation({ summary: 'Login' })
  @ApiOkResponse()
  @Post('/login')
  public async login(@Body() loginDto: LoginReqDto): Promise<ITokenPair> {
    return this.authService.login(loginDto);
  }

  @ApiOperation({ summary: 'Refresh token pair' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('refresh')
  async refresh(
    @Body('refreshToken') refreshToken: string,
  ): Promise<ITokenPair> {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required.');
    }
    return this.authService.refreshToken(refreshToken);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout' })
  @UseGuards(AuthGuard('jwt'))
  @Delete('/logout')
  public async logout(@Req() req: { user: UserEntity }) {
    await this.authService.logout(req.user.id);
    return { message: 'Logged out successfully' };
  }
}
