import { Controller } from '@nestjs/common';
import {
  AcknowledgeRequest,
  JobServiceController,
  JobServiceControllerMethods,
} from '@workhub/grpc';
import { JobService } from './job.service';

@Controller()
@JobServiceControllerMethods()
export class JobController implements JobServiceController {
  constructor(private readonly jobService: JobService) {}
  async acknowledge(request: AcknowledgeRequest) {
    await this.jobService.acknowledge(request.jobId);
  }
}
