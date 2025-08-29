import { Producer } from 'pulsar-client';
import { PulsarClient } from '@workhub/pulsar';
import { serialize } from 'v8';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JobStatus } from '../models/job-status.enum';

export abstract class AbstractJob<T extends object> {
  private producer: Producer;
  protected abstract messageClass: new () => T;

  constructor(
    private readonly pulsarClient: PulsarClient,
    private readonly prismaService: PrismaService
  ) {}

  async execute(data: T | T[], name: string) {
    if (!this.producer) {
      this.producer = await this.pulsarClient.createProducer(name);
    }
    const job = await this.prismaService.job.create({
      data: {
        name,
        size: Array.isArray(data) ? data.length : 1,
        completed: 0,
        status: JobStatus.IN_PROGRESS,
        started: new Date(),
      },
    });
    if (Array.isArray(data)) {
      for (const message of data) {
        this.send({ ...message, jobId: job.id });
      }
    } else {
      this.send({ ...data, jobId: job.id });
      return job;
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
