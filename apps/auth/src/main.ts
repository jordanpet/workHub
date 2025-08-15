require('module-alias/register');
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app/app.module';
import { AUTH_PACKAGE_NAME } from '@workhub/grpc/types/proto';
import { Init } from '@workhub/nestjs';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  try {
    //gRPC microservice
    const grpcOpts: MicroserviceOptions = {
      transport: Transport.GRPC,
      options: {
        package: AUTH_PACKAGE_NAME,
        protoPath: join(
          __dirname,
          '../../../libs/grpc/src/lib/proto/auth.proto'
        ),
        //protoPath: join(__dirname, '../lib/proto/auth.proto'),
        //protoPath: join(__dirname, './proto/auth.proto'),

        url: '0.0.0.0:50051',
      },
    };
    const grpcApp = await NestFactory.createMicroservice(AppModule, grpcOpts);
    await grpcApp.listen();
    console.log('✅ gRPC microservice listening on 0.0.0.0:50051');

    // HTTP / GraphQL server
    const app = await NestFactory.create(AppModule, { bufferLogs: true });
    app.use(cookieParser());
    await Init(app);
    console.log('✅ HTTP / GraphQL server initialized');
  } catch (err) {
    console.error('❌ auth bootstrap failed', (err as Error).stack);
    process.exit(1);
  }
}

bootstrap();
