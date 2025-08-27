import { serial, integer, pgTable, real, text } from 'drizzle-orm/pg-core';

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: text('name'),
  category: text('category'),
  price: real('price'),
  stock: integer('stock'),
  reting: real('reting'),
  description: text('description'),
});
