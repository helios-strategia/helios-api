import { DataSource, Repository } from "typeorm";
import { CalendarEvent } from "@/api/calendar-event/calendar-event.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CalendarEventRepository extends Repository<CalendarEvent> {
  constructor(private readonly dataSource: DataSource) {
    super(CalendarEvent, dataSource.createEntityManager());
  }
}