import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from '../users/user.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AUTH_PACKAGE_NAME } from '@workhub/grpc';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.getOrThrow('JWT_EXPIRATION_MS'),
        },
      }),
      inject: [ConfigService],
    }),
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
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthResolver, AuthService, JwtStrategy],
  exports: [PassportModule],
})
export class AuthModule {}
