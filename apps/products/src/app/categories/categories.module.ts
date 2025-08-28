import { Module } from '@nestjs/common';
import { CateriesService } from './categories.service';

@Module({
  providers: [CateriesService],
  exports: [CateriesService],
})
export class CategoriesModule {}
