import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './db/typeorm.service';
import { ApiModule } from './api/api.module';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { LibraryModule } from '@/library/library.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

import * as config from 'config';
import { EventsModule } from '@/event/events.module';
import { RequestContextModule } from '@/request-context/request-context.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    NestjsFormDataModule,
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    ApiModule,
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
    LibraryModule,
    ConfigModule.forRoot({
      load: [
        () => {
          try {
            return config;
          } catch (e) {
            console.error(
              `Error loading configuration file for env: ${process.env.NODE_ENV}`,
            );
            console.error(e);
            process.exit(1);
          }
        },
      ],
      isGlobal: true,
    }),
    EventEmitterModule.forRoot({
      wildcard: true,
      delimiter: ':',
    }),
    EventsModule,
    RequestContextModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      renderPath: '/',
    }),
  ],

  controllers: [],
  providers: [],
  exports: [AppModule],
})
export class AppModule {}
