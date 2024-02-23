import { INestApplication, ValidationPipe } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { ConfigService } from '@nestjs/config';
import { ConfigEnum } from './config/config.enum';
import { setupSwagger } from './utils/swagger';

export const setupApp = (app: INestApplication, config: ConfigService<unknown, boolean>) => {

  const flag: boolean = config.get(ConfigEnum.LOG_ON) === true;

  flag && app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.setGlobalPrefix('api/v1');

   // 注册 Swagger 的配置顺序
   if (config.get(ConfigEnum.SWAGGER_ENABLE)) {
    setupSwagger(app);
  }
  // 全局拦截器
  app.useGlobalPipes(
    new ValidationPipe({
      // 去除在类上不存在的字段
      whitelist: true,
    }),
  );
  // helmet头部安全
  app.use(helmet());

  // rateLimit限流
  app.use(
    rateLimit({
      windowMs: 1 * 60 * 1000, // 1 minutes
      max: 300, // limit each IP to 100 requests per windowMs
    }),
  );
};
