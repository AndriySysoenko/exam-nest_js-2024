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

  // 1. Перегляд постів користувача
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOkResponse({ type: PostEntity, isArray: true })
  @ApiOperation({ summary: 'Get all posts of a user' })
  @Get('user/:userId')
  public async getUserPosts(
    @Param('userId') userId: string,
    @Query() query: PostQueryDto,
  ): Promise<PaginatedResDto<PostEntity>> {
    return this.postsService.getUserPosts(userId, query);
  }

  // 2. Створення посту
  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new post' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOkResponse({ type: PostEntity })
  public async createPost(
    @Req() req: { user: UserEntity },
    @Body() createPostDto: CreatePostDto,
  ): Promise<PostResDto> {
    return this.postsService.createPost(req.user.id, createPostDto);
  }

  // 3. Видалення посту
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a post' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiResponse({ status: 200, description: 'Post deleted successfully.' })
  @Delete(':postId')
  public async deletePost(
    @Req() req: { user: UserEntity },
    @Param('postId') postId: string,
  ) {
    return this.postsService.deletePost(req.user.id, postId);
  }

  // 4. Редагування посту
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a post' })
  @ApiResponse({ status: 200, description: 'Post updated successfully.' })
  @ApiResponse({ status: 404, description: 'Post not found or unauthorized.' })
  @Patch(':postId')
  public async updatePost(
    @Req() req: { user: UserEntity },
    @Param('postId') postId: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postsService.updatePost(req.user.id, postId, updatePostDto);
  }
}
