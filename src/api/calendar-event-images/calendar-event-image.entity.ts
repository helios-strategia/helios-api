import { Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

import { CalendarEvent } from "@/api/calendar-event/calendar-event.entity";
import { BaseImageEntity } from "@/api/base-image-entity/base-image.entity";

@Entity({ name: 'calendar_event_images' })
@Index(['url'], { unique: false })
@Index(['name'], { unique: false })
export class CalendarEventImage extends BaseImageEntity {
  @ManyToOne(
    () => CalendarEvent,
    (calendarEvent) => calendarEvent.images,
    {
      createForeignKeyConstraints: false,
    },
  )
  @JoinColumn([
    { name: 'calendar_event_id', referencedColumnName: 'id' },
  ])
  public readonly calendarEvent: CalendarEvent;
}
