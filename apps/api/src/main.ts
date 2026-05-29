import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // allow cross-origin requests from Next.js (port 3000)

  const config = new DocumentBuilder()
    .setTitle('BikeMasters WMS API')
    .setDescription('The BikeMasters Workshop Management System API endpoints description')
    .setVersion('1.0')
    .addTag('bikemasters')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(4000);
  console.log(`NestJS Backend running on: http://localhost:4000`);
  console.log(`Swagger Documentation available on: http://localhost:4000/api-docs`);
}
bootstrap();
