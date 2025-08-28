import { Module } from '@nestjs/common';
import { PulsarModule } from '@workhub/pulsar';
import { FibonacciConsumer } from './fibonacci/fibonacci.consumer';
import { LoadProductModule } from './products/load-products.module';

@Module({
  imports: [PulsarModule, LoadProductModule],
  providers: [FibonacciConsumer],
})
export class JobsModule {}
