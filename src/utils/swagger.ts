// swagger
import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export const setupSwagger = (app: INestApplication) => {
  // swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Nestjs Swagger')
    .setDescription('Nestjs backend API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);
};
