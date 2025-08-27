import { Producer } from 'pulsar-client';
import { PulsarClient } from '@workhub/pulsar';
import { serialize } from 'v8';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { BadRequestException } from '@nestjs/common';

export abstract class AbstractJob<T extends object> {
  private producer: Producer;
  protected abstract messageClass: new () => T;

  constructor(private readonly pulsarClient: PulsarClient) {}

  async execute(data: T | T[], job: string) {
    if (!this.producer) {
      this.producer = await this.pulsarClient.createProducer(job);
    }

    if (Array.isArray(data)) {
      for (const message of data) {
        this.send(message);
      }
    } else {
      this.send(data);
    }
  }

  private send(data: T) {
    this.validateData(data).then(() => {
      this.producer.send({ data: serialize(data) });
    });
  }

  private async validateData(data: T | T[]) {
    // **NEW**: if it's an array, validate each element individually
    if (Array.isArray(data)) {
      for (const item of data) {
        const instance = plainToInstance(this.messageClass, item);
        const errors = await validate(instance);
        if (errors.length) {
          throw new BadRequestException(
            `Job data is invalid: ${JSON.stringify(errors)}`
          );
        }
      }
      return;
    }

    // otherwise validate the single object
    const instance = plainToInstance(this.messageClass, data);
    const errors = await validate(instance);
    if (errors.length) {
      throw new BadRequestException(
        `Job data is invalid: ${JSON.stringify(errors)}`
      );
    }
  }
}
