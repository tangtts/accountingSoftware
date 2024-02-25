import { ConfigEnum } from 'src/config/config.enum';
import { Global, Module } from "@nestjs/common";
import { RedisService } from "./redis.service";
import { createClient } from "redis";
import { ConfigService } from "@nestjs/config";


@Global()
@Module({
  exports:[RedisService],
  providers: [
    RedisService,
    {
      inject:[ConfigService],
      provide: "REDIS_CLIENT",
      async useFactory(configService:ConfigService) {
        const client = createClient({
          socket: {
            host: configService.get(ConfigEnum.REDIS_SERVER_HOST),
            port: configService.get(ConfigEnum.REDIS_SERVER_PORT),
          },
          database: configService.get(ConfigEnum.REDIS_SERVER_DB),  // redis 的 database 就是一个命名空间的概念
          username:configService.get(ConfigEnum.REDIS_USERNAME),
          password:configService.get(ConfigEnum.REDIS_PASSWORD),
        });
        await client.connect();
        return client;
      },
    },
  ],
})
export class RedisModule {}
