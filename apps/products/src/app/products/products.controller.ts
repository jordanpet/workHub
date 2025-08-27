import { Controller, UseInterceptors } from '@nestjs/common';
import {
  CreateProductRequest,
  GrpcLoggingInterceptor,
  ProductServiceController,
  ProductServiceControllerMethods,
} from '@workhub/grpc';
import { ProductsService } from './products.service';
@Controller()
@ProductServiceControllerMethods()
@UseInterceptors(GrpcLoggingInterceptor)
export class ProductController implements ProductServiceController {
  constructor(private readonly productsService: ProductsService) {}
  createProduct(request: CreateProductRequest) {
    return this.productsService.createProduct(request);
  }
}
