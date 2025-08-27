import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from '@workhub/nestjs';
import { DatabaseModule } from './database/database.module';
import { ProductModule } from './products/product.module';

@Module({
  imports: [
    ProductModule,
    LoggerModule,
    ConfigModule.forRoot({ isGlobal: true, envFilePath: 'apps/products/.env' }),
    DatabaseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
