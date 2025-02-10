import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { UserEntity } from '../database/entities/user.entity';
import { PostEntity } from '../database/entities/post.entity';
import { PostResDto } from './dto/create-post.res.dto';
import { PostQueryDto } from '../common/pagination/pagination.query.dto';
import { PaginatedResDto } from '../common/pagination/pagination.res.dto';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new post' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOkResponse({ type: PostResDto })
  @Post()
  public async createPost(
    @Req() req: { user: UserEntity },
    @Body() createPostDto: CreatePostDto,
  ): Promise<PostResDto> {
    return this.postsService.createPost(req.user.id, createPostDto);
  }

  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOkResponse({ type: PostResDto, isArray: true })
  @ApiOperation({ summary: 'Get all posts of a user' })
  @Get('user/:userId')
  public async getUserPosts(
    @Param('userId') userId: string,
    @Query() query: PostQueryDto,
  ): Promise<PaginatedResDto<PostResDto>> {
    return this.postsService.getUserPosts(userId, query);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a post' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOkResponse({ type: PostResDto })
  @Patch(':postId')
  public async updatePost(
    @Req() req: { user: UserEntity },
    @Param('postId') postId: string,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<PostResDto> {
    return this.postsService.updatePost(req.user.id, postId, updatePostDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a post' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOkResponse({
    schema: { example: { message: 'Post successfully deleted' } },
  })
  @Delete(':postId')
  public async deletePost(
    @Req() req: { user: UserEntity },
    @Param('postId') postId: string,
  ) {
    return this.postsService.deletePost(req.user.id, postId);
  }
}
