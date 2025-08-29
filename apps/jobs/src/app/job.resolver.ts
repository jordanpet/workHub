import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { JobMetadata } from './models/job-metadata.model';
import { JobService } from './job.service';
import { ExecuteJobInput } from './dtos/execute-job.input';
import { UseGuards } from '@nestjs/common';
import { GrpcAuthGuard } from '@workhub/guards';
import { Job } from './models/job.model';

@Resolver()
export class JobResolver {
  constructor(private readonly jobService: JobService) {}

  @Query(() => [JobMetadata], { name: 'jobsMetadata' })
  @UseGuards(GrpcAuthGuard)
  async getJobMetadata() {
    return this.jobService.getJobMetadata();
  }

  @Query(() => Job, { name: 'job' })
  @UseGuards(GrpcAuthGuard)
  async getJob(@Args('id', { type: () => Int }) id: number) {
    return this.jobService.getJob(id);
  }

  @Query(() => [Job], { name: 'jobs' })
  @UseGuards(GrpcAuthGuard)
  async getJobs() {
    return this.jobService.getJobs();
  }

  @Mutation(() => Job)
  @UseGuards(GrpcAuthGuard)
  async executeJob(@Args('executeJobInput') executeJobInput: ExecuteJobInput) {
    return this.jobService.executeJob(
      executeJobInput.name,
      executeJobInput.data
    );
  }
}
