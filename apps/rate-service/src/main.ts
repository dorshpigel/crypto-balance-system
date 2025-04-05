import { NestFactory } from '@nestjs/core';
import { RateServiceModule } from './rate-service.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(RateServiceModule);

  const config = new DocumentBuilder()
    .setTitle('Rate Service')
    .setDescription('Provides crypto rates')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // http://localhost:3001/api
  await app.listen(process.env.ratePort ?? 3001);
}
bootstrap();
