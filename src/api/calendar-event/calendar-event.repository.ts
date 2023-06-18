import { DataSource, Repository } from 'typeorm';
import { CalendarEvent } from '@/api/calendar-event/calendar-event.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CalendarEventRepository extends Repository<CalendarEvent> {
  constructor(private readonly dataSource: DataSource) {
    super(CalendarEvent, dataSource.createEntityManager());
  }

  public findAllByPlantAndStartAtAndEndAt({
    plantId,
    startDate,
    endDate,
  }: {
    plantId: number;
    startDate?: Date;
    endDate?: Date;
  }) {
    const query = this.createQueryBuilder().where(
      'calendar_event.plant_id = :plantId',
      { plantId },
    );

    if (startDate && endDate) {
      query
        .andWhere('calendar_event.start_date >= :startDate', { startDate })
        .andWhere('calendar_event.end_date <= :endDate', { endDate });
    } else if (startDate) {
      query.andWhere('calendar_event.start_date >= :startDate', { startDate });
    } else if (endDate) {
      query.andWhere('calendar_event.end_date <= :endDate', { endDate });
    }

    return query.getMany();
  }
}
