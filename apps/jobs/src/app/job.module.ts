import { Module } from '@nestjs/common';
import { Fibonacci } from './jobs/fibonacci/fibonacci.job';
import { AUTH_PACKAGE_NAME } from '@workhub/grpc';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { DiscoveryModule } from '@golevelup/nestjs-discovery';
import { JobService } from './job.service';
import { JobResolver } from './job.resolver';
import { join } from 'path';
import { PulsarModule } from '@workhub/pulsar';
@Module({
  imports: [
    DiscoveryModule,
    PulsarModule,
    ClientsModule.register([
      {
        name: AUTH_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          package: AUTH_PACKAGE_NAME,
          protoPath: join(
            __dirname,
            '../../../libs/grpc/src/lib/proto/auth.proto'
          ),
          // protoPath: join(__dirname, '../lib/proto/auth.proto'),
          // protoPath: join(process.cwd(), 'libs/grpc/src/lib/proto/auth.proto'),
          //protoPath: join(__dirname, './proto/auth.proto'),
          url: 'localhost:50051',
        },
      },
    ]),
  ],
  providers: [Fibonacci, JobService, JobResolver],
  exports: [ClientsModule],
})
export class JobModule {}
