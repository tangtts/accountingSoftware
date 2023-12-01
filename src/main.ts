import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ResponseFormatInterceptorInterceptor } from './response-format.interceptor';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService =  app.get(ConfigService)
  app.useGlobalPipes(new ValidationPipe())
  app.useGlobalInterceptors(new ResponseFormatInterceptorInterceptor())
  await app.listen(configService.get("nest_server_port"));
}

bootstrap();
