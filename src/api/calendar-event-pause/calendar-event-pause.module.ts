import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CalendarEventPause } from "@/api/calendar-event-pause/calendar-event-pause.entity";


@Module({
  imports: [TypeOrmModule.forFeature([CalendarEventPause])],
  controllers: [],
  providers: [],
})
export class CalendarEventPauseModule {}
