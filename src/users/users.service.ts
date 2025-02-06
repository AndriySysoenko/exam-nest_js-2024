import { Injectable, NotFoundException } from '@nestjs/common';
// import { UpdateUserReqDto } from './dto/req/update-user.req.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../database/entities/user.entity';
import { Repository } from 'typeorm';
import { QueryDto } from '../common/pagination/pagination.dto';
import { PaginatedResDto } from '../common/pagination/pagination.service';
import { paginateRawAndEntities } from 'nestjs-typeorm-paginate';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}
  // public async create(createUserDto: CreateUserReqDto): Promise<any> {
  //   return 'This action adds a new user';
  // }

  public async findAll(query?: QueryDto): Promise<PaginatedResDto> {
    const queryBuilder = this.usersRepository.createQueryBuilder('user');

    const selectFields = [
      'age',
      'gender',
      '"isActive"',
      'role',
      '"createdAt"',
      '"updatedAt"',
    ];
    queryBuilder.select(selectFields.map((field) => `user.${field}`));
    Object.keys(query).forEach((key) => {
      if (selectFields.includes(key)) {
        let value = query[key];

        if (key === 'isActive') value = query[key] === 'true';
        if (key === 'age') value = Number(query[key]);

        queryBuilder.andWhere(`user.${key} = :${key}`, { [key]: value });
      }
    });
    // if (query.search) {
    //   queryBuilder.andWhere(
    //     'LOWER(name) LIKE :search OR LOWER(email) LIKE :search OR LOWER("nickName") LIKE :search OR age LIKE :search',
    //     { search: `%${query.search}%` },
    //   );
    // }

    const [pagination, rawEntities] = await paginateRawAndEntities(
      queryBuilder,
      {
        page: +query?.page || 1,
        limit: +query?.limit || 10,
      },
    );

    return {
      page: pagination.meta.currentPage,
      limit: pagination.meta.itemsPerPage,
      total: pagination.meta.totalItems,
      entities: rawEntities,
    };
  }

  public async findById(id: string): Promise<UserEntity> {
    return this.usersRepository.findOne({ where: { id } });
  }

  // public async update(
  //   id: string,
  //   updateUserDto: UpdateUserReqDto,
  // ): Promise<any> {
  //   return `This action updates a #${id} user`;
  // }
  async remove(id: string): Promise<{ message: string }> {
    const result = await this.usersRepository.delete(id);
    if (!result.affected) throw new NotFoundException('User not found');
    return { message: 'User deleted' };
  }
}
