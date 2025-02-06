import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  CreateUserReqDto,
  LoginReqDto,
} from '../users/dto/req/create-user.req.dto';
import { AuthGuard } from '@nestjs/passport';
import { ITokenPayload } from '../common/interfaces/ITokenPayload';
import { UserResDto } from '../users/dto/res/user.res.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOkResponse({ type: UserResDto })
  @Post('/signup')
  async signUp(@Body() dataAuthDto: CreateUserReqDto) {
    return this.authService.signUp(dataAuthDto);
  }

  @Post('/login')
  async login(@Body() loginDto: LoginReqDto) {
    return this.authService.login(loginDto);
  }

  // @Get()
  // findAll() {
  //   return this.authService.findAll();
  // }
  //
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.authService.findOne(+id);
  // }
  //
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
  //   return this.authService.update(+id, updateAuthDto);
  // }
  //

  // @Delete('logout')
  // async logout(@Req() req: Request): Promise<void> {
  //   const userId = req.user.id; // Предполагается, что JwtGuard добавляет user в request
  //   return this.authService.logout(userId);
  // }

  @Post('/logout')
  @UseGuards(AuthGuard('jwt'))
  async logout(@Req() req: { user: ITokenPayload }) {
    await this.authService.logout(req.user.sub);
    return { message: 'Logged out successfully' };
  }
}

//   @Delete('logout')
//   async logout(@Body('userId') userId: 'UserEntity[id]'): Promise<void> {
//     return this.authService.logout(userId);
//   }
// }
