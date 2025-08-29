import { Module } from '@nestjs/common';
import { LoadProductConsumer } from './load-products.consumer';
import { PulsarModule } from '@workhub/pulsar';
import { ConfigService } from '@nestjs/config';
import { Package } from '@workhub/grpc';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { JobClientModule } from '../job-clients.module';

@Module({
  imports: [
    PulsarModule,
    JobClientModule,
    ClientsModule.registerAsync([
      {
        name: Package.PRODUCTS,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: Package.PRODUCTS,
            protoPath: join(
              __dirname,
              '../../../libs/grpc/src/lib/proto/products.proto'
            ),
            // protoPath: join(__dirname, '../lib/proto/auth.proto'),
            // protoPath: join(process.cwd(), 'libs/grpc/src/lib/proto/auth.proto'),
            //protoPath: join(__dirname, './proto/auth.proto'),
            url: configService.getOrThrow('PRODUCTS_GRPC_SERVICE_URL'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [LoadProductConsumer],
})
export class LoadProductModule {}
