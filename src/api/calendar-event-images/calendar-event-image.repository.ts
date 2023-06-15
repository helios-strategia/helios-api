import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CalendarEventImage } from "@/api/calendar-event-images/calendar-event-image.entity";

@Injectable()
export class CalendarEventImageRepository extends Repository<CalendarEventImage> {
  public constructor(private readonly dataSource: DataSource) {
    super(CalendarEventImage, dataSource.createEntityManager());
  }
}
