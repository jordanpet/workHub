import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  Package,
  PRODUCT_SERVICE_NAME,
  ProductServiceClient,
} from '@workhub/grpc';
import { Jobs } from '@workhub/nestjs';
import {
  LoadProductMessage,
  PulsarClient,
  PulsarConsumer,
} from '@workhub/pulsar';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class LoadProductConsumer
  extends PulsarConsumer<LoadProductMessage>
  implements OnModuleInit
{
  private productsService: ProductServiceClient;
  constructor(
    pulsarClient: PulsarClient,
    @Inject(Package.PRODUCTS) private client: ClientGrpc
  ) {
    super(pulsarClient, Jobs.LOAD_PRODUCTS);
  }

  async onModuleInit() {
    this.productsService = this.client.getService(PRODUCT_SERVICE_NAME);
    await super.onModuleInit();
  }

  protected async onMessage(data: LoadProductMessage) {
    await firstValueFrom(this.productsService.createProduct(data));
  }
}
