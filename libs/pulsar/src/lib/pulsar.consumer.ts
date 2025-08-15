import { Consumer, Message } from 'pulsar-client';
import { PulsarClient } from './pulsar.client';
import { deserialize } from 'v8';
import { Logger } from '@nestjs/common';

export abstract class PulsarConsumer<T> {
  private consumer!: Consumer;
  protected readonly logger = new Logger(this.topic);
  constructor(
    private readonly pulsarClient: PulsarClient,
    private readonly topic: string
  ) {
    this.logger = new Logger(topic);
  }
  async onModuleInit() {
    this.consumer = await this.pulsarClient.createConsumer(
      this.topic,
      this.listener.bind(this)
    );
  }
  private async listener(message: Message) {
    try {
      const rawData = message.getData();
      const uint8Data =
        rawData instanceof Buffer
          ? new Uint8Array(
              rawData.buffer,
              rawData.byteOffset,
              rawData.byteLength
            )
          : rawData;

      const data = deserialize(uint8Data) as T;
      this.logger.debug(`Received message ${JSON.stringify(data)}`);
      await this.onMessage(data);
    } catch (error) {
      this.logger.error(error);
    } finally {
      await this.consumer.acknowledge(message);
    }
  }
  protected abstract onMessage(data: T): Promise<void>;
}
