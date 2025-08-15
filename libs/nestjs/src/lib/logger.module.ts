import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    PinoLoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const isProduction = config.get('NODE_ENV') === 'production';

        const pinoHttpOptions: any = {
          level: isProduction ? 'info' : 'debug',
        };

        if (!isProduction) {
          pinoHttpOptions.transport = {
            target: 'pino-pretty',
            options: {
              singleLine: true,
              colorize: true,
            },
          };
        }
        return { pinoHttp: pinoHttpOptions };
      },
    }),
  ],
})
export class LoggerModule {}
