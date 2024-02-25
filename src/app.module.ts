import {  IncomeOrExpenses } from "./income/entities/incomeOrExpenses.entity";
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserModule } from "./user/user.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user/entities/user.entity";
import { RedisModule } from "./redis/redis.module";
import { JwtModule } from "@nestjs/jwt";
import { CommonModule } from "./common/common.module";
import { CommonCategories } from "./common/entities/commonCategories.entity";
import { IncomeModule } from "./income/incomeOrExpenses.module";
import { APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { AuthGuard } from "./auth.guard";
import { BudgetModule } from "./budget/budget.module";
import { Budget } from "./budget/entities/budget.entity";
import { TimeRangeBudget } from "./budget/entities/budgetDetail.entity";
import * as Joi from "joi";
import * as dotenv from "dotenv";
import { ConfigEnum } from "./config/config.enum";
import { Logger } from "winston";
import logger from "./middlewares/logger.middleware";
import { winstonConfig } from "./utils/winton";
import { ResponseFormatInterceptorInterceptor } from "./interceptors/response-format.interceptor";

const schema = Joi.object({
  NODE_ENV: Joi.string()
    .valid("development", "production")
    .default("development"),
  MYSQL_SERVER_HOST: Joi.alternatives().try(
    Joi.string().ip(),
    Joi.string().domain()
  ),
  MYSQL_SERVER_PORT: Joi.number().port().default(3306).required(),
  MYSQL_SERVER_USERNAME: Joi.string().required(),
  MYSQL_SERVER_PASSWORD: Joi.string().required(),
  // 不能含有数字
  MYSQL_SERVER_DATABASE: Joi.string()
    .pattern(/\D{4,}/)
    .required(),
});
@Module({
  imports: [
    UserModule,
    RedisModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        process.env.NODE_ENV === "development"
          ? '.env.development'
          : '.env.production',
          '.env',
      ],
      validationSchema: schema,
      load: [
        () => {
          const values = dotenv.config({ path:'.env' });
          const { error } = schema.validate(values?.parsed, {
            // 允许未知的环境变量
            allowUnknown: true,
            // 如果有错误，不要立即停止，而是收集所有错误
            abortEarly: false,
          });
          if (error) {
            throw new Error(
              `Validation failed - Is there an environment variable missing?
      ${error.message}`
            );
          }
          return values;
        },
      ],
    }),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get(ConfigEnum.JWT_SECRET),
          signOptions: {
            expiresIn: configService.get(
              ConfigEnum.JWT_ACCESS_TOKEN_EXPIRES_TIME
            ),
          },
        };
      },
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: "mysql",
          host: configService.get(ConfigEnum.MYSQL_SERVER_HOST),
          port: configService.get(ConfigEnum.MYSQL_SERVER_PORT),
          username: configService.get(ConfigEnum.MYSQL_SERVER_USERNAME),
          password: configService.get(ConfigEnum.MYSQL_SERVER_PASSWORD),
          database: configService.get(ConfigEnum.MYSQL_SERVER_DATABASE),
          entities: [
            User,
            CommonCategories,
            IncomeOrExpenses,
            Budget,
            TimeRangeBudget,
          ],
          synchronize: true,
          logging: true,
          connectorPackage: "mysql2",
        };
      },
    }),
    CommonModule,
    IncomeModule,
    BudgetModule,
    winstonConfig()
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass:ResponseFormatInterceptorInterceptor
    }
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
     // 应用全局中间件
    consumer.apply(logger).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
