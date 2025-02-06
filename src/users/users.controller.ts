import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
// import { UpdateUserReqDto } from './dto/req/update-user.req.dto';
import {
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { PaginatedResDto } from '../common/pagination/pagination.service';
import { ITokenPayload } from '../common/interfaces/ITokenPayload';
import { UserEntity } from '../database/entities/user.entity';
import { UserResDto } from './dto/res/user.res.dto';
// import { UserItemDto } from './dto/res/sign-up.res.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOkResponse({ type: UserEntity })
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async getMe(@Req() req: { user: ITokenPayload }) {
    return this.usersService.findById(req.user.sub);
  }

  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOkResponse({ type: PaginatedResDto })
  @UseGuards(AuthGuard('jwt'))
  // @ApiPaginatedResponse('entities', PaginatedResDto)
  @Get('/list')
  public async findAll(): Promise<PaginatedResDto> {
    return this.usersService.findAll();
  }

  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOkResponse({ type: UserResDto })
  @Get(':id')
  public async findOne(@Param('id') id: string): Promise<UserResDto> {
    const user = await this.usersService.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  // @ApiNotFoundResponse({ description: 'Not found' })
  // @ApiForbiddenResponse({ description: 'Forbidden' })
  // @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  // @Patch(':id')
  // public async update(
  //   @Param('id') id: string,
  //   @Body() updateUserDto: UpdateUserReqDto,
  // ): Promise<UserResDto> {
  //   return this.usersService.update(id, updateUserDto);
  // }

  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Delete('me')
  public async remove(
    @Req() req: { user: ITokenPayload },
  ): Promise<{ message: string }> {
    return this.usersService.remove(req.user.sub);
  }
}
