import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductController } from './products.controller';

@Module({
  providers: [ProductsService],
  controllers: [ProductController],
})
export class ProductModule {}
