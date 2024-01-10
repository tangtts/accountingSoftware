import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ResponseFormatInterceptorInterceptor } from './response-format.interceptor';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Exception } from './exception.filter';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService =  app.get(ConfigService)
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform:true
  }))
  app.useGlobalInterceptors(new ResponseFormatInterceptorInterceptor())
  // 默认是 static 目录,可以修改为 my-uploads
  app.useStaticAssets('my-uploads',{prefix:'/static/'})
  // 不能在这，否则用不了 Reflect
  // app.useGlobalGuards(new AuthGuard())

  app.useGlobalFilters(new Exception())
  await app.listen(configService.get("nest_server_port"));
}

bootstrap();
