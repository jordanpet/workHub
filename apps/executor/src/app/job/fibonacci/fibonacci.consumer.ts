import { Injectable, OnModuleInit } from '@nestjs/common';
import { PulsarClient, PulsarConsumer } from '@workhub/pulsar';
import { iterate } from 'fibonacci';
import { FibonacciMessage } from '@workhub/pulsar';
import { Jobs } from '@workhub/nestjs';

@Injectable()
export class FibonacciConsumer
  extends PulsarConsumer<FibonacciMessage>
  implements OnModuleInit
{
  constructor(pulsarClient: PulsarClient) {
    super(pulsarClient, Jobs.FIBONACCI);
  }

  protected async onMessage(data: FibonacciMessage): Promise<void> {
    const result = iterate(data.iterations);
    this.logger.log(result);
  }
}
