import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JobModule } from './jobs/job.module';

@Module({
  imports: [ConfigModule, JobModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
