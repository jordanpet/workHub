import { Module } from '@nestjs/common';
import { PulsarModule } from '@workhub/pulsar';
import { FibonacciConsumer } from './fibonacci/fibonacci.consumer';
import { LoadProductModule } from './products/load-products.module';
import { JobClientModule } from './job-clients.module';

@Module({
  imports: [PulsarModule, LoadProductModule, JobClientModule],
  providers: [FibonacciConsumer],
})
export class JobsModule {}
