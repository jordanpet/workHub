import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app/app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const logger = new Logger('hub-jobs');

  try {
    const app = await NestFactory.create(AppModule, { logger });
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      })
    );
    app.use(cookieParser());
    app.setGlobalPrefix('api');
    app.enableShutdownHooks();

    const config = app.get(ConfigService);
    const port = config.get<number>('PORT') ?? 3001;
    await app.listen(port);
    logger.log(
      `🚀 hub-jobs HTTP server running on http://localhost:${port}/api`
    );
  } catch (err) {
    logger.error('❌ hub-jobs bootstrap failed', (err as Error).stack);
    process.exit(1);
  }
}

bootstrap();
