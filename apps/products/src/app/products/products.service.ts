import { Inject, Injectable } from '@nestjs/common';
import { DATABASE_CONNECTION } from '../database/database-connection';
import * as schema from './schema';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { CateriesService } from '../categories/categories.service';

@Injectable()
export class ProductsService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
    private readonly categoriesService: CateriesService
  ) {}
  async createProduct(
    product: Omit<typeof schema.products.$inferSelect, 'id'>
  ) {
    const category = await this.categoriesService.getCategoryByName(
      product.category
    );
    await this.database.insert(schema.products).values({
      ...product,
      price: category ? product.price + category.charge : product.price,
    });
  }
}
