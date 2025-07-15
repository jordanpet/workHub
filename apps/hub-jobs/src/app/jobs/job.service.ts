import {
  DiscoveredClassWithMeta,
  DiscoveryService,
} from '@golevelup/nestjs-discovery';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { JOB_METADATA_KEY } from '../decorators/job.decorator';
import { AbstractJob } from './abstract.job';

@Injectable()
export class JobService implements OnModuleInit {
  private jobs: DiscoveredClassWithMeta<AbstractJob>[] = [];
  constructor(private readonly discoverySevice: DiscoveryService) {}

  async onModuleInit() {
    this.jobs = await this.discoverySevice.providersWithMetaAtKey<AbstractJob>(
      JOB_METADATA_KEY
    );
  }
}
