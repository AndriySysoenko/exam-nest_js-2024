import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostEntity } from '../database/entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postsRepository: Repository<PostEntity>,
  ) {}

  public async getUserPosts(userId: string): Promise<PostEntity[]> {
    return this.postsRepository.find({ where: { user: { id: userId } } });
  }

  public async createPost(
    userId: string,
    createPostDto: CreatePostDto,
  ): Promise<PostEntity> {
    const newPost = this.postsRepository.create({
      ...createPostDto,
      user: { id: userId },
    });
    return this.postsRepository.save(newPost);
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

  public async updatePost(
    userId: string,
    postId: string,
    updatePostDto: UpdatePostDto,
  ): Promise<PostEntity> {
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
}
