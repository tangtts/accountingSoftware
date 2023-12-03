import { IncomeOrCost } from './income/entities/income.entity';
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserModule } from "./user/user.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user/entities/user.entity";
import { RedisModule } from "./redis/redis.module";
import { JwtModule } from "@nestjs/jwt";
import { CommonModule } from './common/common.module';
import { CommonCategories } from "./common/entities/commonCategories.entity";
import { IncomeModule } from './income/income.module';
@Module({
  imports: [
    UserModule,
    RedisModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env" ,
    }),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get("jwt_secret"),
          signOptions: {
            expiresIn: configService.get("jwt_access_token_expires_time"),
          },
        };
      },
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: "mysql",
          host: configService.get("mysql_server_host"),
          port: configService.get("mysql_server_port"),
          username: configService.get("mysql_server_username"),
          password: configService.get("mysql_server_password"),
          database: configService.get("mysql_server_database"),
          entities: [User,CommonCategories,IncomeOrCost],
          synchronize: true,
          logging: true,
          connectorPackage: "mysql2",
          extra: {
            authPlugin: "sha256_password",
          },
        };
      },
    }),
    CommonModule,
    IncomeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
