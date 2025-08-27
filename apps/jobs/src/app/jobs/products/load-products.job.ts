import { Jobs } from '@workhub/nestjs';
import { Job } from '../../decorators/job.decorator';
import { AbstractJob } from '../abstract.job';
import { LoadProductMessage, PulsarClient } from '@workhub/pulsar';
@Job({
  name: Jobs.LOAD_PRODUCTS,
  description: 'Loads uploaded product data into the DB after enrichhment.',
})
export class LoadProductJob extends AbstractJob<LoadProductMessage> {
  protected messageClass = LoadProductMessage;

  constructor(pulsarClient: PulsarClient) {
    super(pulsarClient);
  }
}
