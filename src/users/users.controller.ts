import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
  NotFoundException,
  Query,
  UnauthorizedException,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { PaginatedResDto } from '../common/pagination/pagination.res.dto';
import { UserEntity } from '../database/entities/user.entity';
import { UserResDto } from './dto/res/user.res.dto';
import { QueryDto } from '../common/pagination/pagination.query.dto';
import { UpdateUserReqDto } from './dto/req/update-user.req.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOkResponse({ type: UserEntity })
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  public async getMe(@Req() req: { user: UserEntity }): Promise<UserEntity> {
    if (!req.user?.id) {
      throw new UnauthorizedException('User ID is missing in token');
    }
    return this.usersService.findProfile(req.user.id);
  }

  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOkResponse({ type: PaginatedResDto })
  @UseGuards(AuthGuard('jwt'))
  @Get('list')
  public async findAll(
    @Query() query: QueryDto,
  ): Promise<PaginatedResDto<UserResDto>> {
    return this.usersService.findAll(query);
  }

  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOkResponse({ type: UserResDto })
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  public async findById(@Param('id') id: string): Promise<UserResDto> {
    const user = await this.usersService.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOkResponse({ type: UserResDto })
  @UseGuards(AuthGuard('jwt'))
  @Get('email/:email')
  public async findByEmail(@Param('email') email: string): Promise<UserResDto> {
    console.log('This', email);
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOkResponse({ type: UserEntity })
  @UseGuards(AuthGuard('jwt'))
  @Patch('me')
  public async updateMe(
    @Req() req: { user: UserEntity },
    @Body() updateUserDto: UpdateUserReqDto,
  ): Promise<UserEntity> {
    return this.usersService.updateCurrentUser(req.user.id, updateUserDto);
  }

  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiResponse({ status: 200, description: 'User deleted successfully.' })
  @UseGuards(AuthGuard('jwt'))
  @Delete('me')
  public async remove(
    @Req() req: { user: UserEntity },
  ): Promise<{ message: string }> {
    return this.usersService.remove(req.user.id);
  }
}
