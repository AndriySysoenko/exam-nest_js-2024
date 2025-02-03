import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserReqDto } from './dto/req/create-user.req.dto';
import { UpdateUserReqDto } from './dto/req/update-user.req.dto';
import {
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserResDto } from './dto/res/user.res.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOkResponse({ type: UserResDto })
  @Post()
  public async create(
    @Body() createUserDto: CreateUserReqDto,
  ): Promise<UserResDto> {
    return this.usersService.create(createUserDto);
  }

  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOkResponse({ type: UserResDto })
  @Get('/list')
  public async findAll(): Promise<[UserResDto]> {
    return this.usersService.findAll();
  }

  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get(':id')
  public async findOne(@Param('id') id: string): Promise<UserResDto> {
    return this.usersService.findOne(id);
  }

  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Patch(':id')
  public async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserReqDto,
  ): Promise<UserResDto> {
    return this.usersService.update(id, updateUserDto);
  }

  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Delete(':id')
  public async remove(@Param('id') id: string): Promise<any> {
    return this.usersService.remove(id);
  }
}
