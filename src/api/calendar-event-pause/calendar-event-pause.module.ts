import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalendarEventPause } from '@/api/calendar-event-pause/calendar-event-pause.entity';
import { CalendarEventPauseProfile } from '@/api/calendar-event-pause/calendar-event-pause.profile';

@Module({
  imports: [TypeOrmModule.forFeature([CalendarEventPause])],
  controllers: [],
  providers: [CalendarEventPauseProfile],
})
export class CalendarEventPauseModule {}
