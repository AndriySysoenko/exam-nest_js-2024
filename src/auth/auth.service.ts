import { BadRequestException, Injectable } from '@nestjs/common';
// import { CreateAuthDto } from './dto/create-auth.dto';
// import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../database/entities/user.entity';
// import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InjectRedisClient, RedisClient } from '@webeleon/nestjs-redis';
import { CreateUserReqDto } from '../users/dto/req/create-user.req.dto';
import { UserResDto } from '../users/dto/res/user.res.dto';

@Injectable()
export class AuthService {
  constructor(
    // private jwtService: JwtService,
    @InjectRedisClient() private readonly redisClient: RedisClient,
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    // @InjectRepository(RefreshToken)
    // private refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  async signUpUser(dataAuthDto: CreateUserReqDto): Promise<UserResDto> {
    // try {
    const findUser = await this.usersRepository.findOne({
      where: { email: dataAuthDto.email },
    });
    if (findUser) {
      throw new BadRequestException('User with this email already exist.');
    }

    const hashedPassword = await bcrypt.hash(dataAuthDto.password, 10);
    const newUser = await this.usersRepository.save(
      this.usersRepository.create({
        ...dataAuthDto,
        password: hashedPassword,
      }),
    );
    return {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      createdAt: newUser.created,
    };
    // } catch() {
    //   throw new BadRequestException('Error during registration');
    // }
  }

  // create(createAuthDto: CreateAuthDto) {
  //   return 'This action adds a new auth';
  // }
  //
  // findAll() {
  //   return `This action returns all auth`;
  // }
  //
  // findOne(id: number) {
  //   return `This action returns a #${id} auth`;
  // }
  //
  // update(id: number, updateAuthDto: UpdateAuthDto) {
  //   return `This action updates a #${id} auth`;
  // }
  //
  // remove(id: number) {
  //   return `This action removes a #${id} auth`;
  // }
}
