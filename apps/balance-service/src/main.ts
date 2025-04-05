import { NestFactory } from '@nestjs/core';
import { BalanceServiceModule } from './balance-service.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(BalanceServiceModule);

  const config = new DocumentBuilder()
  .setTitle('Balance Service')
  .setDescription('Manages user crypto balances')
  .setVersion('1.0')
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api', app, document); // http://localhost:3000/api

  await app.listen(process.env.balancePort?? 3000);
}
bootstrap();
