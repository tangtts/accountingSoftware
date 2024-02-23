import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ResponseFormatInterceptorInterceptor } from './response-format.interceptor';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigEnum } from './config/config.enum';
import { setupApp } from './setup';
import { Exception } from './filters/http-exception.filter';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule,{
    cors: true,
  });

  const configService = app.get(ConfigService)
  
  setupApp(app,configService)

  app.useGlobalInterceptors(new ResponseFormatInterceptorInterceptor())
  // 默认是 static 目录,可以修改为 my-uploads
  app.useStaticAssets('my-uploads',{prefix:'/static/'})
  app.useGlobalFilters(new Exception())
  await app.listen(configService.get(ConfigEnum.NSET_SERVER_PORT));
}

bootstrap();
