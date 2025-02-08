import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../database/entities/user.entity';
import { Repository } from 'typeorm';
import { QueryDto } from '../common/pagination/pagination.dto';
import { PaginatedResDto } from '../common/pagination/pagination.service';
import { paginateRawAndEntities } from 'nestjs-typeorm-paginate';
import { AuthService } from '../auth/auth.service';
import { UserResDto } from './dto/res/user.res.dto';
import { endOfDay, startOfDay } from 'date-fns';
import { UpdateUserReqDto } from './dto/req/update-user.req.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  public async findProfile(id: string): Promise<UserEntity> {
    console.log(id);
    return this.usersRepository.findOne({ where: { id } });
  }

  public async findAll(query?: QueryDto): Promise<PaginatedResDto> {
    const queryBuilder = this.usersRepository.createQueryBuilder('user');

    const selectFields = [
      'name',
      'nickName',
      'email',
      'age',
      'gender',
      'isActive',
      'role',
      'createdAt',
      'updatedAt',
    ];
    queryBuilder.select(selectFields.map((field) => `user.${field}`));
    Object.keys(query).forEach((key) => {
      if (selectFields.includes(key)) {
        let value = query[key];

        if (key === 'isActive') value = query[key] === 'true';
        if (key === 'age') value = Number(query[key]);
        if (key === 'createdAt' || key === 'updatedAt') {
          const date = new Date(query[key]);
          const startOfDayDate = startOfDay(date); // Початок дня
          const endOfDayDate = endOfDay(date);
          queryBuilder.andWhere('user.createdAt BETWEEN :start AND :end', {
            start: startOfDayDate,
            end: endOfDayDate,
          });
          return;
        }
        queryBuilder.andWhere(`user.${key} = :${key}`, { [key]: value });
      }
    });

    if (query.search) {
      queryBuilder.andWhere(
        '(LOWER(user.name) LIKE :search OR LOWER(user.email) LIKE :search OR LOWER(user.nickName) LIKE :search OR CAST(user.age AS TEXT) LIKE :search)',
        { search: `%${query.search}%` },
      );
    }

    if (query.sort && selectFields.includes(query.sort)) {
      const orderDirection =
        query.order?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC'; // За замовчуванням ASC
      queryBuilder.orderBy(`user.${query.sort}`, orderDirection);
    }

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

  public async findById(id: string): Promise<UserResDto> {
    return this.usersRepository.findOne({ where: { id } });
  }

  public async findByEmail(email: string): Promise<UserResDto> {
    return this.usersRepository.findOneBy({ email });
  }

  public async updateCurrentUser(
    userId: string,
    updateUserDto: UpdateUserReqDto,
  ): Promise<UserEntity> {
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) {
      throw new Error('User not found.');
    }

    for (const [key, value] of Object.entries(updateUserDto)) {
      if (value !== undefined && value !== null) {
        if (key === 'password') {
          user[key] = await bcrypt.hash(value, 10);
        } else {
          user[key] = value;
        }
      }
    }

    return this.usersRepository.save(user);
  }

  async remove(id: string): Promise<{ message: string }> {
    const result = await this.usersRepository.delete(id);
    if (!result.affected) throw new NotFoundException('User not found');
    return { message: 'User deleted' };
  }
}
