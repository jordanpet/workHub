import { Inject, Injectable } from '@nestjs/common';
import { DATABASE_CONNECTION } from '../database/database-connection';
import * as schema from './schema';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

@Injectable()
export class ProductsService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>
  ) {}
  async createProduct(
    product: Omit<typeof schema.products.$inferSelect, 'id'>
  ) {
    await this.database.insert(schema.products).values({
      ...product,
    });
  }
}
