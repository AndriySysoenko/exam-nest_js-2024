import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule } from '@nestjs-modules/ioredis';

import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';
import configuration from './common/configs/configuration';
import { DatabaseModule } from './database/database.module';


@Module({
  imports: [
    ConfigModule.forRoot({ load: [configuration], isGlobal: true }),
    RedisModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'single',
        url: `redis://${configService.get<string>('redis.host')}:${configService.get<number>('redis.port')}`,
      }),
    }),
    DatabaseModule,
    UsersModule,
    PostsModule,
    AuthModule,
  ],

  controllers: [],
  providers: [],
})
export class AppModule {}
