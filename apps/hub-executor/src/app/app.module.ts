import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // ← import this
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      // ← add this
      isGlobal: true, // makes ConfigService available app-wide
      envFilePath: 'apps/hub-executor/.env', // adjust path if needed
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
