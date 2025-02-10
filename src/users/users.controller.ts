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
import {
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { UsersService } from './users.service';
import { PaginatedResDto } from '../common/pagination/pagination.res.dto';
import { UserEntity } from '../database/entities/user.entity';
import { UserResDto } from './dto/user.res.dto';
import { QueryDto } from '../common/pagination/pagination.query.dto';
import { UpdateUserReqDto } from './dto/update-user.req.dto';

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
  @ApiOperation({ summary: 'Getting your profile data ' })
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
  @ApiBody({ type: UpdateUserReqDto })
  @ApiOkResponse({ type: UserEntity })
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Updating your profile data' })
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
  @ApiOkResponse({ type: PaginatedResDto })
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Getting a list of users. Only authorized users' })
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
  @ApiOperation({
    summary: 'Getting user data by his ID. Only authorized user',
  })
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
  @ApiOperation({
    summary: 'Getting user data by email. Only authorized users.',
  })
  @Get('email/:email')
  public async findByEmail(@Param('email') email: string): Promise<UserResDto> {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOkResponse({
    schema: { example: { message: 'User successfully deleted' } },
  })
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Deleting your profile' })
  @Delete('me')
  public async remove(@Req() req: { user: UserEntity }) {
    return this.usersService.remove(req.user.id);
  }
}
