import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JobModule } from './job.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { LoggerModule } from '@workhub/nestjs';
import { GqlLoggingPlugin } from '@workhub/graphql';
import { UploadModule } from './uploads/upload.module';

@Module({
  imports: [
    LoggerModule,
    UploadModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'apps/jobs/.env',
    }),
    JobModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      plugins: [new GqlLoggingPlugin()],
      playground: {
        settings: {
          'request.credentials': 'include',
        },
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
