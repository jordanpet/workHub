import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Job } from './models/job.model';
import { JobService } from './job.service';
import { ExecuteJobInput } from './dtos/execute-job.input';
import { UseGuards } from '@nestjs/common';
import { GrpcAuthGuard } from '@workhub/guards';

@Resolver()
export class JobResolver {
  constructor(private readonly jobService: JobService) {}
  @Query(() => [Job], { name: 'jobs' })
  @UseGuards(GrpcAuthGuard)
  async getJob() {
    return this.jobService.getJob();
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
