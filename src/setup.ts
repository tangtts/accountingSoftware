import { INestApplication, ValidationPipe } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { ConfigService } from '@nestjs/config';
import { ConfigEnum } from './config/config.enum';
import { setupSwagger } from './utils/swagger';
import { TypeormFilter } from './filters/typeorm.filter';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { AllExceptionFilter } from './filters/AllExceptionFilter.filter';

export const setupApp = (app: INestApplication, config: ConfigService<unknown, boolean>) => {

  const flag: boolean = config.get(ConfigEnum.LOG_ON) === true;
  const nestWinston = app.get(WINSTON_MODULE_NEST_PROVIDER);
  flag && app.useLogger(nestWinston);
  app.setGlobalPrefix('api/v1');
  // 异常拦截写入日志
  app.useGlobalFilters(new TypeormFilter(),new HttpExceptionFilter(nestWinston),flag &&  new AllExceptionFilter(nestWinston))
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
