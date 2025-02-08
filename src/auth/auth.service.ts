import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../database/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import {
  CreateUserReqDto,
  LoginReqDto,
} from '../users/dto/req/create-user.req.dto';
import { ITokenPair } from '../common/interfaces/ITokenPair';
import { ITokenPayload } from '../common/interfaces/ITokenPayload';
import { RefreshToken } from '../database/entities/refresh-token.entity';
import Redis from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { UserResDto } from '../users/dto/res/user.res.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRedis() private readonly redisClient: Redis,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  public async signUp(
    dataAuthDto: CreateUserReqDto,
  ): Promise<{ newUser: UserResDto; tokens: ITokenPair }> {
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

    const tokens = await this.generateTokens(newUser);
    const userResDto = plainToInstance(UserResDto, newUser, {
      excludeExtraneousValues: true,
    });
    return { newUser: userResDto, tokens };

    // } catch {
    //   throw new BadRequestException('Error during registration');
    // }
  }
  public async validateUser(
    email: string,
    password: string,
  ): Promise<UserEntity> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  public async login(loginDto: LoginReqDto): Promise<ITokenPair> {
    try {
      const user = await this.validateUser(loginDto.email, loginDto.password);
      return this.generateTokens(user);
    } catch {
      throw new UnauthorizedException('Login failed');
    }
  }

  async logout(userId: string): Promise<void> {
    try {
      await this.redisClient.del(`access_token:${userId}`);
      const isExist = await this.redisClient.exists(`access_token:${userId}`);
      console.log('Exsist in redis after logout:', isExist);
      await this.refreshTokenRepository.delete({ userId });
    } catch {
      throw new BadRequestException('Logout failed');
    }
  }

  private async generateTokens(user: UserEntity): Promise<ITokenPair> {
    const payload: ITokenPayload = {
      email: user.email,
      sub: user.id,
      password: user.password,
    };
    const accessToken = this.jwtService.sign(payload);
    await this.redisClient.set(
      `access_token:${payload.sub}`,
      accessToken,
      'EX',
      900,
    );

    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    await this.refreshTokenRepository.save({
      userId: payload.sub,
      token: refreshToken,
    });

    const tokenPair: ITokenPair = {
      accessToken,
      refreshToken,
    };
    return tokenPair;
  }
}
