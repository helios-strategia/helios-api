import { BaseEntity } from '@/api/base-entity/base.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { CalendarEvent } from '@/api/calendar-event/calendar-event.entity';
import { AutoMap } from '@automapper/classes';

@Index('calendar_event_id_index', ['calendarEvent'], { unique: false })
@Entity('calendar_event_pause', { schema: 'public' })
export class CalendarEventPause extends BaseEntity {
  @AutoMap()
  @Column('timestamp with time zone', { name: 'start_at', nullable: false })
  public readonly startAt: Date;

  @AutoMap()
  @Column('timestamp with time zone', { name: 'end_at', nullable: true })
  public readonly endAt: Date;

  @ManyToOne(() => CalendarEvent, (calendarEvent) => calendarEvent.pauses, {
    onDelete: 'NO ACTION',
    createForeignKeyConstraints: false,
  })
  @JoinColumn([{ name: 'calendar_event_id', referencedColumnName: 'id' }])
  public readonly calendarEvent: CalendarEvent;
}
