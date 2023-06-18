import { Module } from '@nestjs/common';
import { CalendarEventController } from './calendar-event.controller';
import { CalendarEventService } from './calendar-event.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalendarEvent } from './calendar-event.entity';
import { CalendarEventRepository } from '@/api/calendar-event/calendar-event.repository';
import { ServiceModule } from '@/service/service.module';
import { PlantModule } from '@/api/plant/plant.module';
import { CalendarEventImageModule } from '@/api/calendar-event-images/calendar-event-image.module';
import { CalendarEventProfile } from '@/api/calendar-event/calendar-event.profile';
import { NestjsFormDataModule } from 'nestjs-form-data';

@Module({
  imports: [
    TypeOrmModule.forFeature([CalendarEvent]),
    ServiceModule,
    PlantModule,
    CalendarEventImageModule,
    NestjsFormDataModule,
  ],
  controllers: [CalendarEventController],
  providers: [
    CalendarEventService,
    CalendarEventRepository,
    CalendarEventProfile,
  ],
})
export class CalendarEventModule {}
