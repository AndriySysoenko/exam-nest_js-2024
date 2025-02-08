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

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // 1. Перегляд постів користувача
  @Get('user/:userId')
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOkResponse({ type: PostEntity, isArray: true })
  @ApiOperation({ summary: 'Get all posts of a user' })
  public async getUserPosts(@Param('userId') userId: string) {
    return this.postsService.getUserPosts(userId);
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
  ): Promise<PostEntity> {
    // const userId = req.user['id'];
    return this.postsService.createPost(req.user.id, createPostDto);
  }

  // 3. Видалення посту
  @Delete(':postId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a post' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiResponse({ status: 200, description: 'Post deleted successfully.' })
  async deletePost(
    @Req() req: { user: UserEntity },
    @Param('postId') postId: string,
  ) {
    // const userId = req.user['id'];
    return this.postsService.deletePost(req.user.id, postId);
  }

  // 4. Редагування посту
  @Patch(':postId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a post' })
  @ApiResponse({ status: 200, description: 'Post updated successfully.' })
  @ApiResponse({ status: 404, description: 'Post not found or unauthorized.' })
  async updatePost(
    @Req() req,
    @Param('postId') postId: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    const userId = req.user['id'];
    return this.postsService.updatePost(userId, postId, updatePostDto);
  }
}
