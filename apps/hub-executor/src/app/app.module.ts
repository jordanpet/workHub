import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JobsModule } from './job/jobs.module';
@Module({
  imports: [
    JobsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'apps/hub-executor/.env',
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
