import { PulsarClient } from '@workhub/pulsar';
import { Job } from '../../decorators/job.decorator';
import { AbstractJob } from '../abstract.job';
import { FibonacciMessage } from '@workhub/pulsar';
import { Jobs } from '@workhub/nestjs';

@Job({
  name: Jobs.FIBONACCI,
  description: 'Generate a Fibonacci sequence and store it in the DB.',
})
export class Fibonacci extends AbstractJob<FibonacciMessage> {
  protected messageClass = FibonacciMessage;
  constructor(pulsarClient: PulsarClient) {
    super(pulsarClient);
  }
}
