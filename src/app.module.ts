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
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { BudgetModule } from './budget/budget.module';
import { Budget } from './budget/entities/budget.entity';
import { TimeRangeBudget } from './budget/entities/budgetDetail.entity';
import * as Joi from 'joi';
import * as dotenv from 'dotenv';
import { ConfigEnum } from './config/config.enum';


const schema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production')
    .default('development'),
  MYSQL_SERVER_HOST: Joi.string().ip().required(),
  MYSQL_SERVER_PORT: Joi.number().port().default(3306).required(),
  MYSQL_SERVER_USERNAME: Joi.string().required(),
  MYSQL_SERVER_PASSWORD: Joi.string().required(),
  // 不能含有数字
  MYSQL_SERVER_DATABASE: Joi.string().pattern(/\D{4,}/).required()
});
@Module({
  imports: [
    UserModule,
    RedisModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [process.env.NODE_ENV === "development" ? '.env.development' : '.env.production', '.env',
      ],
      validationSchema: schema,
      load: [() => {
        const values = dotenv.config({ path: '.env' });
        const { error } = schema.validate(values?.parsed, {
          // 允许未知的环境变量
          allowUnknown: true,
          // 如果有错误，不要立即停止，而是收集所有错误
          abortEarly: false,
        });
        if (error) {
          throw new Error(
            `Validation failed - Is there an environment variable missing?
      ${error.message}`,
          );
        }
        return values;
      }]
    }),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get(ConfigEnum.JWT_SECRET),
          signOptions: {
            expiresIn: configService.get(ConfigEnum.JWT_ACCESS_TOKEN_EXPIRES_TIME),
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
          entities: [User, CommonCategories, IncomeOrCost, Budget, TimeRangeBudget],
          synchronize: true,
          logging: false,
          connectorPackage: "mysql2"
        };
      },
    }),
    CommonModule,
    IncomeModule,
    BudgetModule,
  ],
  controllers: [AppController],
  providers: [AppService,
  ],
})
export class AppModule { }
