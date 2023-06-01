import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './db/typeorm.service';
import { ApiModule } from './api/api.module';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { ServiceModule } from './service/service.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

import * as config from 'config';
import { EventsModule } from '@/event/events.module';

@Module({
  imports: [
    NestjsFormDataModule,
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    ApiModule,
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
    ServiceModule,
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
  ],

  controllers: [],
  providers: [],
  exports: [AppModule],
})
export class AppModule {}
