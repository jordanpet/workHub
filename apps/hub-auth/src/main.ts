import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app/app.module';
import { AUTH_PACKAGE_NAME } from 'types/proto/auth';
import { Init } from '@workhub/nestjs';
import * as cookieParser from 'cookie-parser';

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
    app.use(cookieParser());
    await Init(app);
  } catch (err) {
    logger.error('❌ hub-auth bootstrap failed', (err as Error).stack);
    process.exit(1);
  }
}

bootstrap();
