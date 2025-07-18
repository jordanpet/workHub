import { Module } from '@nestjs/common';
import { Fibonacci } from './fibonscci.job';
import { DiscoveryModule } from '@golevelup/nestjs-discovery';
import { JobService } from './job.service';
import { JobResolver } from './job.resolver';

@Module({
  imports: [DiscoveryModule],
  providers: [Fibonacci, JobService, JobResolver],
})
export class JobModule {}
