import { Module } from '@nestjs/common';
import { PulsarModule } from '@workhub/pulsar';
import { FibonacciConsumer } from './fibonacci/fibonacci.consumer';

@Module({
  imports: [PulsarModule],
  providers: [FibonacciConsumer],
})
export class JobsModule {}
