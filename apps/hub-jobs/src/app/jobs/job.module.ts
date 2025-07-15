import { Module } from '@nestjs/common';
import { Fibonacci } from './fibonscci.job';
import { DiscoveryModule } from '@golevelup/nestjs-discovery';
import { JobService } from './job.service';

@Module({
  imports: [DiscoveryModule],
  providers: [Fibonacci, JobService],
})
export class JobModule {}
