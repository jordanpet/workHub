import { Client, Producer, Message } from 'pulsar-client';

export class PulsarClient {
  private client: Client;

  constructor() {
    this.client = new Client({
      serviceUrl: 'pulsar://localhost:6650',
    });
  }

  async createProducer(topic: string): Promise<Producer> {
    return await this.client.createProducer({ topic });
  }

  async close(): Promise<void> {
    await this.client.close();
  }
}
