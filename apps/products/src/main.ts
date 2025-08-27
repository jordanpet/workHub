require('module-alias/register');
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app/app.module';
import { Package } from '@workhub/grpc';
import { Init } from '@workhub/nestjs';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule, { bufferLogs: true });
    //gRPC microservice
    const grpcOpts: MicroserviceOptions = {
      transport: Transport.GRPC,
      options: {
        url: app.get(ConfigService).getOrThrow('PRODUCTS_GRPC_SERVICE_URL'),
        package: Package.PRODUCTS,
        protoPath: join(
          __dirname,
          '../../../libs/grpc/src/lib/proto/products.proto'
        ),
        //protoPath: join(__dirname, '../lib/proto/auth.proto'),
        //protoPath: join(__dirname, './proto/auth.proto'),
      },
    };
    const grpcApp = await NestFactory.createMicroservice(AppModule, grpcOpts);
    await grpcApp.listen();
    console.log('✅ gRPC microservice listening on 0.0.0.0:50051');

    // HTTP / GraphQL server
    app.use(cookieParser());
    await Init(app);
    console.log('✅ HTTP / GraphQL server initialized');
  } catch (err) {
    console.error('❌ auth bootstrap failed', (err as Error).stack);
    process.exit(1);
  }
}

bootstrap();
