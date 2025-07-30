import { Injectable, OnModuleInit } from '@nestjs/common';
import { PulsarClient, PulsarConsumer } from '@workhub/pulsar';
import { Message } from 'pulsar-client';

@Injectable()
export class FibonacciConsumer extends PulsarConsumer implements OnModuleInit {
  constructor(pulsarClient: PulsarClient) {
    super(pulsarClient, 'Fibonacci');
  }
  protected async onMessage(message: Message): Promise<void> {
    console.log('FibonacciConsumer.message');
    await this.acknowledge(message);
  }
}
