import { ClientGrpc } from '@nestjs/microservices';
import {
  AcknowledgeRequest,
  JOB_SERVICE_NAME,
  JobServiceClient,
} from '@workhub/grpc';
import { PulsarClient, PulsarConsumer } from '@workhub/pulsar';
import { firstValueFrom } from 'rxjs';

export abstract class JobConsumer<
  T extends AcknowledgeRequest
> extends PulsarConsumer<T> {
  private jobService: JobServiceClient;

  constructor(
    topic: string,
    pulsarClient: PulsarClient,
    private readonly grpcClient: ClientGrpc
  ) {
    super(pulsarClient, topic);
  }
  async onModuleInit(): Promise<void> {
    this.grpcClient.getService<JobServiceClient>(JOB_SERVICE_NAME);
    await super.onModuleInit();
  }
  protected async onMessage(data: T): Promise<void> {
    await this.execute(data);
    await firstValueFrom(this.jobService.acknowledge(data));
  }
  protected abstract execute(data: T): Promise<void>;
}
