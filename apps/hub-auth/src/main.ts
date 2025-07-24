import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app/app.module';
import { ConfigService } from '@nestjs/config';
import { AUTH_PACKAGE_NAME } from 'types/proto/auth';

async function bootstrap() {
  const logger = new Logger('hub-auth');

  try {
    //gRPC microservice
    const grpcOpts: MicroserviceOptions = {
      transport: Transport.GRPC,
      options: {
        package: AUTH_PACKAGE_NAME,
        protoPath: join(__dirname, 'proto/auth.proto'),
        url: '0.0.0.0:50051',
      },
    };
    const grpcApp = await NestFactory.createMicroservice(AppModule, grpcOpts);
    await grpcApp.listen();
    logger.log('✅ gRPC microservice listening on 0.0.0.0:50051');

    // HTTP / GraphQL server
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
    const port = config.get<number>('PORT') ?? 3000;
    await app.listen(port);
    logger.log(`🚀 HTTP server running at http://localhost:${port}/api`);
  } catch (err) {
    logger.error('❌ hub-auth bootstrap failed', (err as Error).stack);
    process.exit(1);
  }
}

bootstrap();
