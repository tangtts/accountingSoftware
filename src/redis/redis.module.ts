import { Global, Module } from "@nestjs/common";
import { RedisService } from "./redis.service";
import { createClient } from "redis";
import { ConfigService } from "@nestjs/config";
import { Config } from "../config/configType";


@Global()
@Module({
  exports:[RedisService],
  providers: [
    RedisService,
    {
      inject:[ConfigService],
      provide: "REDIS_CLIENT",
      async useFactory(configService:ConfigService<Config>) {
        const client = createClient({
          socket: {
            host: configService.get("REDIS.HOST",{infer:true}),
            port: configService.get("REDIS.PORT",{infer:true}),
          },
          database: configService.get("REDIS.DB",{infer:true}),  // redis 的 database 就是一个命名空间的概念
          username:configService.get("REDIS.USERNAME",{infer:true}),
          password:configService.get("REDIS.PASSWORD",{infer:true}),
        });
        await client.connect();
        return client;
      },
    },
  ],
})
export class RedisModule {}
