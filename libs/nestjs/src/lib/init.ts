import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';

export async function Init(app: INestApplication) {
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
    app.useLogger(app.get(Logger));

    const config = app.get(ConfigService);
    const port = config.get<number>('PORT') ?? 3001;
    await app.listen(port);
    app
      .get(Logger)
      .log(`🚀 jobs HTTP server running on http://localhost:${port}/api`);
  } catch (err) {
    app.get(Logger).error('❌ jobs bootstrap failed', (err as Error).stack);
    process.exit(1);
  }
}
