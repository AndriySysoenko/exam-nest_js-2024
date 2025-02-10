import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostEntity } from '../database/entities/post.entity';
import { plainToInstance } from 'class-transformer';
import { PostResDto } from './dto/create-post.res.dto';
import { paginateRawAndEntities } from 'nestjs-typeorm-paginate';
import { PostQueryDto } from '../common/pagination/pagination.query.dto';
import { PaginatedResDto } from '../common/pagination/pagination.res.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postsRepository: Repository<PostEntity>,
  ) {}

  public async createPost(
    userId: string,
    createPostDto: CreatePostDto,
  ): Promise<PostResDto> {
    const newPost = await this.postsRepository.save(
      this.postsRepository.create({
        ...createPostDto,
        user: { id: userId },
      }),
    );
    return plainToInstance(PostResDto, newPost, {
      excludeExtraneousValues: true,
    });
  }

  public async getUserPosts(
    userId: string,
    query?: PostQueryDto,
  ): Promise<PaginatedResDto<PostResDto>> {
    const queryBuilder = this.postsRepository
      .createQueryBuilder('post')
      .where('post.user_id = :userId', { userId })
      .orderBy('post.createdAt', 'DESC');

    const [pagination, rawEntities] = await paginateRawAndEntities(
      queryBuilder,
      {
        page: +query?.page || 1,
        limit: +query?.limit || 10,
      },
    );
    return {
      page: pagination.meta.currentPage,
      pages: pagination.meta.totalPages,
      limit: pagination.meta.itemsPerPage,
      total: pagination.meta.totalItems,
      entities: rawEntities,
    };
  }

  public async updatePost(
    userId: string,
    postId: string,
    updatePostDto: UpdatePostDto,
  ): Promise<PostResDto> {
    const post = await this.postsRepository.findOne({
      where: { id: postId, user: { id: userId } },
    });
    if (!post)
      throw new NotFoundException(
        'Post not found or you do not have permission to edit it.',
      );

    Object.assign(post, updatePostDto);
    return this.postsRepository.save(post);
  }

  public async deletePost(userId: string, postId: string): Promise<void> {
    const post = await this.postsRepository.findOne({
      where: { id: postId, user: { id: userId } },
    });
    if (!post)
      throw new NotFoundException(
        'Post not found or you do not have permission to delete it.',
      );
    await this.postsRepository.delete(postId);
  }
}
