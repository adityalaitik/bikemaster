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

  const port = Number(process.env.PORT) || 4000;
  await app.listen(port);
  console.log(`NestJS Backend running on: http://localhost:${port}`);
  console.log(`Swagger Documentation available on: http://localhost:${port}/api-docs`);
}
bootstrap();
