import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Package } from '@workhub/grpc';
import { join } from 'path';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: Package.JOBS,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            url: configService.getOrThrow('JOBS_GRPC_SERVICE_URL'),
            package: Package.JOBS,
            protoPath: join(__dirname, '../../libs/grpc/proto/jobs.proto'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class JobClientModule {}
