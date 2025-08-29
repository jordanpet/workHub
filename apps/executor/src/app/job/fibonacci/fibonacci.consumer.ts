import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { PulsarClient } from '@workhub/pulsar';
import { iterate } from 'fibonacci';
import { FibonacciMessage } from '@workhub/pulsar';
import { Jobs } from '@workhub/nestjs';
import { JobConsumer } from '../job.consumer';
import { Package } from '@workhub/grpc';
import { ClientGrpc } from '@nestjs/microservices';

@Injectable()
export class FibonacciConsumer
  extends JobConsumer<FibonacciMessage>
  implements OnModuleInit
{
  constructor(
    @Inject(Package.JOBS) clientJobs: ClientGrpc,
    pulsarClient: PulsarClient
  ) {
    super(Jobs.FIBONACCI, pulsarClient, clientJobs);
  }

  protected async execute(data: FibonacciMessage): Promise<void> {
    const result = iterate(data.iterations);
    this.logger.log(result);
  }
}
