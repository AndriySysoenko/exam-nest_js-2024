import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { ITokenPayload } from '../common/interfaces/ITokenPayload';
import Redis from 'ioredis';
// import { AuthService } from './auth.service';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { ITokenPair } from '../common/interfaces/ITokenPair';
import { ITokenPayload } from '../common/interfaces/ITokenPayload';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  //   async validate(
  //     tokenPair: ITokenPair,
  //   ): Promise<{ password: string; email: string }> {
  //     try {
  //       const decodeToken: any = this.jwtService.decode(tokenPair.accessToken);
  //       if (
  //         !(await this.redisClient.exists(`access_token:${decodeToken.email}`))
  //       ) {
  //         throw new UnauthorizedException();
  //       }
  //
  //       await this.jwtService.verifyAsync(tokenPair.accessToken);
  //       const user = await this.authService.validateUser(
  //         decodeToken.email,
  //         decodeToken.password,
  //       );
  //       return user;
  //     } catch (error) {
  //       console.log(error);
  //       throw new UnauthorizedException();
  //     }
  //   }
  // }

  async validate(payload: ITokenPayload): Promise<{ id: string }> {
    console.log('Decoded payload:', payload);
    const redisKey = `access_token:${payload.sub}`;
    const isExist = await this.redisClient.exists(redisKey);
    console.log('Exsist in redis:', isExist);
    const accessTokenInRedis = await this.redisClient.get(redisKey);

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
    } catch (error) {
      throw new UnauthorizedException('Access token is invalid or expired.');
    }
  }
}
