import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  Package,
  PRODUCT_SERVICE_NAME,
  ProductServiceClient,
} from '@workhub/grpc';
import { Jobs } from '@workhub/nestjs';
import { LoadProductMessage, PulsarClient } from '@workhub/pulsar';
import { firstValueFrom } from 'rxjs';
import { JobConsumer } from '../job.consumer';

@Injectable()
export class LoadProductConsumer
  extends JobConsumer<LoadProductMessage>
  implements OnModuleInit
{
  private productsService: ProductServiceClient;
  constructor(
    pulsarClient: PulsarClient,
    @Inject(Package.JOBS) clientJobs: ClientGrpc,
    @Inject(Package.PRODUCTS) private clientProduct: ClientGrpc
  ) {
    super(Jobs.LOAD_PRODUCTS, pulsarClient, clientJobs);
  }

  async onModuleInit() {
    this.productsService = this.clientProduct.getService(PRODUCT_SERVICE_NAME);
    await super.onModuleInit();
  }

  protected async execute(data: LoadProductMessage) {
    await firstValueFrom(this.productsService.createProduct(data));
  }
}
