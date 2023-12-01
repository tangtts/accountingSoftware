import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import {ConfigModule, ConfigService} from "@nestjs/config"
import {TypeOrmModule} from "@nestjs/typeorm"
import { User } from './user/entities/user.entity';
import { RedisModule } from './redis/redis.module';
@Module({
  imports: [
    UserModule,ConfigModule.forRoot({
    isGlobal:true,
    envFilePath:'.env'
  }),
  RedisModule,
  TypeOrmModule.forRootAsync({
    inject:[ConfigService],
    useFactory:(configService:ConfigService)=>{
      return {
        type: "mysql",
          host: configService.get("mysql_server_host"),
          port: configService.get("mysql_server_port"),
          username: configService.get("mysql_server_username"),
          password: configService.get("mysql_server_password"),
          database: configService.get("mysql_server_database"),
          entities:[User],
          synchronize: true,
          logging: true,
          connectorPackage: "mysql2",
          extra: {
            authPlugin: "sha256_password",
          },
      }
    }
  })

],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
