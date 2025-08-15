import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { PrismaModule } from '../prisma/prisma.module';

const AUTH_PACKAGE_NAME = 'auth';

@Module({
  imports: [
    PrismaModule,
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
  providers: [UserResolver, UserService],
  exports: [UserService],
})
export class UserModule {}
