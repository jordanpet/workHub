import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';

export async function Init(app: INestApplication) {
  const logger = new Logger('hub-jobs');

  try {
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
