import { BaseEntity } from '@/types/base-entity';
import { CalendarEventType } from '@/types/calendar-event/calendar-event-type.enum';
import { CalendarEventImagesResponseDto } from '@/types/calendar-event-images';
import { CalendarEventPauseResponseDto } from '@/types/calendar-event-pause';

export interface CalendarEventResponseDto extends BaseEntity {
  readonly calendarEventType: CalendarEventType;
  readonly description: string | null;
  readonly endDate: Date;
  readonly startDate: Date;
  readonly title: string;
  readonly pauses: CalendarEventPauseResponseDto[];
  readonly images: CalendarEventImagesResponseDto[];
}
