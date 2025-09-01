import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';

export async function Init(app: INestApplication, globalPrefix = 'api') {
  try {
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      })
    );
    app.use(cookieParser());
    app.setGlobalPrefix(globalPrefix);
    app.enableShutdownHooks(); // check this on
    app.useLogger(app.get(Logger));

    const config = app.get(ConfigService);
    const port = config.get<number>('PORT') ?? 3003; // app.get(ConfigService).getOrThrow('PORT');
    await app.listen(port);
    app
      .get(Logger)
      .log(`🚀 jobs HTTP server running on http://localhost:${port}/api`);
  } catch (err) {
    app.get(Logger).error('❌ jobs bootstrap failed', (err as Error).stack);
    process.exit(1);
  }
}
