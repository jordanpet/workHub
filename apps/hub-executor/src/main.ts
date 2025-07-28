import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { Init } from '@workhub/nestjs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await Init(app);
}

bootstrap();
