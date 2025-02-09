import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import Redis from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { AuthService } from './auth.service';
import { ITokenPayload } from '../common/interfaces/ITokenPayload';
import { UserEntity } from '../database/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRedis() private readonly redisClient: Redis,
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }
  async validate(payload: ITokenPayload): Promise<{ id: string }> {
    const accessTokenInRedis = await this.redisClient.get(
      `access_token:${payload.sub}`,
    );
    if (!accessTokenInRedis) {
      throw new UnauthorizedException('Access token not found in Redis.');
    }

    try {
      const verifiedPayload = await this.jwtService.verifyAsync(
        accessTokenInRedis,
        {
          secret: process.env.JWT_SECRET,
        },
      );

      if (
        verifiedPayload.sub !== payload.sub ||
        verifiedPayload.email !== payload.email
      ) {
        throw new UnauthorizedException('Invalid token payload.');
      }

      const user = await this.usersRepository.findOne({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('User not found.');
      }

      return user;
    } catch {
      throw new UnauthorizedException('Access token is invalid or expired.');
    }
  }
}
