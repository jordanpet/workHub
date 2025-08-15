import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JobsModule } from './job/jobs.module';
import { LoggerModule } from '@workhub/nestjs';
@Module({
  imports: [
    LoggerModule,
    JobsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'apps/executor/.env',
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
