import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { BaseEntity } from '../base-entity/base.entity';
import { Plant } from '../plant/plant.entity';
import { CalendarEventType } from '@/types/calendar-event'
import { CalendarEventPause } from "@/api/calendar-event-pause/calendar-event-pause.entity";
import { AutoMap } from "@automapper/classes";
import { CalendarEventImage } from "@/api/calendar-event-images/calendar-event-image.entity";

@Index('plant_id_index', ['plant'], { unique: false })
@Entity('calendar_event', { schema: 'public' })
export class CalendarEvent extends BaseEntity {
  @AutoMap()
  @Column('enum', {
    name: 'calendar_event_type',
    enum: CalendarEventType,
    default: CalendarEventType.PlannedWork
  })
  public readonly calendarEventType: CalendarEventType;

  @AutoMap()
  @Column('character varying', {
    nullable: true,
    length: 1024,
  })
  public readonly description: string | null;

  @AutoMap()
  @Column('timestamp with time zone', { name: 'end_date', nullable: false })
  public readonly endDate: Date;

  @AutoMap()
  @Column('timestamp with time zone', { name: 'start_date', nullable: false })
  public readonly startDate: Date;

  @AutoMap()
  @Column('character varying', { name: 'title', nullable: true, length: 255 })
  public readonly title: string;

  @AutoMap(() => Plant)
  @ManyToOne(() => Plant, (plant) => plant.calendarEvents, {
    onDelete: 'NO ACTION',
    createForeignKeyConstraints: false,
  })
  @JoinColumn([{ name: 'plant_id', referencedColumnName: 'id' }])
  public readonly plant: Plant;

  @AutoMap(() => [CalendarEventPause])
  @OneToMany(() => CalendarEventPause,
    (calendarEventPause) => calendarEventPause.calendarEvent,
    {
      createForeignKeyConstraints: false,
      onDelete: 'NO ACTION'
    }
  )
  public readonly pauses: CalendarEventPause[];

  @AutoMap(() => [CalendarEventImage])
  @OneToMany(() => CalendarEventImage,
    (calendarEventImage) => calendarEventImage.calendarEvent)
  public readonly images: CalendarEventImage[]
}
