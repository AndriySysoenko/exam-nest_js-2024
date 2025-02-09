import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../database/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { QueryFailedError, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import {
  CreateUserReqDto,
  LoginReqDto,
} from '../users/dto/req/create-user.req.dto';
import { ITokenPair } from '../common/interfaces/ITokenPair';
import { ITokenPayload } from '../common/interfaces/ITokenPayload';
import Redis from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { UserResDto } from '../users/dto/res/user.res.dto';
import { plainToInstance } from 'class-transformer';
import { RefreshTokenEntity } from '../database/entities/refresh-token.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRedis() private readonly redisClient: Redis,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(RefreshTokenEntity)
    private readonly refreshTokenRepository: Repository<RefreshTokenEntity>,
  ) {}

  public async signUp(
    dataAuthDto: CreateUserReqDto,
  ): Promise<{ newUser: UserResDto; tokens: ITokenPair }> {
    try {
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
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new InternalServerErrorException(
          'Database error during registration',
        );
      }
      throw new BadRequestException('Error during registration');
    }
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

  public async logout(userId: string): Promise<void> {
    try {
      await this.redisClient.del(`access_token:${userId}`);
      await this.refreshTokenRepository.delete({ userId });
    } catch {
      throw new BadRequestException('Logout failed');
    }
  }

  private async generateTokens(user: UserEntity): Promise<ITokenPair> {
    try {
      const payload: ITokenPayload = {
        email: user.email,
        sub: user.id,
        password: user.password,
      };
      const accessToken = this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN,
      });
      await this.redisClient.set(
        `access_token:${payload.sub}`,
        accessToken,
        'EX',
        900,
      );

      const refreshToken = this.jwtService.sign(payload, {
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
        secret: process.env.JWT_REFRESH_SECRET,
      });
      await this.refreshTokenRepository.upsert(
        { userId: user.id, token: refreshToken },
        ['userId'],
      );

      const refreshTokenEntity = await this.refreshTokenRepository.findOne({
        where: { userId: user.id },
      });
      if (refreshTokenEntity) {
        user.refreshToken = refreshTokenEntity;
        await this.usersRepository.save(user);
      }
      const tokenPair: ITokenPair = {
        accessToken,
        refreshToken,
      };
      return tokenPair;
    } catch {
      throw new InternalServerErrorException(
        'Database error during token generation',
      );
    }
  }

  public async refreshToken(oldRefreshToken: string): Promise<ITokenPair> {
    if (!oldRefreshToken) {
      throw new UnauthorizedException('Refresh token is required.');
    }
    try {
      this.jwtService.verify<ITokenPayload>(oldRefreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token.');
    }

    const tokenEntity = await this.refreshTokenRepository.findOne({
      where: { token: oldRefreshToken },
    });
    if (!tokenEntity) {
      throw new UnauthorizedException('Refresh token not found.');
    }
    const user = await this.usersRepository.findOne({
      where: { id: tokenEntity.userId },
    });
    if (!user) {
      throw new UnauthorizedException('User not found.');
    }

    const newTokens = await this.generateTokens(user);
    await this.refreshTokenRepository.delete({ token: oldRefreshToken });

    return newTokens;
  }
}
