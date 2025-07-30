import { Module } from '@nestjs/common';
import { Fibonacci } from './jobs/fibonacci/fibonacci.job';
import { AUTH_PACKAGE_NAME } from 'types/proto/auth';
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
          protoPath: join(process.cwd(), 'proto', 'auth.proto'),
          url: 'localhost:50051',
        },
      },
    ]),
  ],
  providers: [Fibonacci, JobService, JobResolver],
  exports: [ClientsModule],
})
export class JobModule {}
