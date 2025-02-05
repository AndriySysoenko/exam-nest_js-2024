import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
import { ITokenPayload } from '../common/interfaces/ITokenPayload';
import Redis from 'ioredis';
// import { AuthService } from './auth.service';
import { InjectRedis } from '@nestjs-modules/ioredis';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@InjectRedis() private readonly redisClient: Redis) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(
    payload: ITokenPayload,
  ): Promise<{ userId: string; email: string }> {
    try {
      if (!(await this.redisClient.exists(`access_token:${payload.sub}`))) {
        throw new UnauthorizedException();
      }
      return { userId: payload.sub, email: payload.email };
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException();
    }
  }
}
