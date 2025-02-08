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
  Query,
  UnauthorizedException,
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
import { QueryDto } from '../common/pagination/pagination.dto';
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
  public async getMe(@Req() req: { user: UserEntity }) {
    console.log('req.user:', req.user.id);
    if (!req.user?.id) {
      throw new UnauthorizedException('User ID is missing in token');
    }
    return this.usersService.findProfile(req.user.id);
  }

  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOkResponse({ type: PaginatedResDto })
  @UseGuards(AuthGuard('jwt'))
  // @ApiPaginatedResponse('entities', PaginatedResDto)
  @Get('list')
  public async findAll(@Query() query: QueryDto): Promise<PaginatedResDto> {
    return this.usersService.findAll(query);
  }

  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOkResponse({ type: UserResDto })
  @UseGuards(AuthGuard('jwt'))
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
  @UseGuards(AuthGuard('jwt'))
  @Delete('me')
  public async remove(
    @Req() req: { user: ITokenPayload },
  ): Promise<{ message: string }> {
    return this.usersService.remove(req.user.sub);
  }
}
