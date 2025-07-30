import { Producer } from 'pulsar-client';
import { PulsarClient } from '@workhub/pulsar';
import { serialize } from 'v8';

export abstract class AbstractJob<T> {
  private producer: Producer;
  constructor(private readonly pulsarClient: PulsarClient) {}
  async execute(data: T, job: string) {
    if (!this.producer) {
      this.producer = await this.pulsarClient.createProducer(job);
    }
    await this.producer.send({ data: serialize(data) });
  }
}
