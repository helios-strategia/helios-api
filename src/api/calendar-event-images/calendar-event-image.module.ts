import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceModule } from '@/service/service.module';
import { CalendarEventImage } from '@/api/calendar-event-images/calendar-event-image.entity';
import { CalendarEventImageRepository } from '@/api/calendar-event-images/calendar-event-image.repository';
import { CalendarEventImageService } from '@/api/calendar-event-images/calendar-event-image.service';
import { CalendarEventImageProfile } from '@/api/calendar-event-images/calendar-event-image.profile';

@Module({
  imports: [TypeOrmModule.forFeature([CalendarEventImage]), ServiceModule],
  providers: [
    CalendarEventImageRepository,
    CalendarEventImageService,
    CalendarEventImageProfile,
  ],
  exports: [CalendarEventImageService],
})
export class CalendarEventImageModule {}
