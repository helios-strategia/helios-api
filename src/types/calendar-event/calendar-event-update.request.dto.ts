import { CalendarEventType } from '@/types/calendar-event/calendar-event-type.enum';
import { MemoryStoredFile } from 'nestjs-form-data';

export interface CalendarEventUpdateRequestDto {
  readonly calendarEventType?: CalendarEventType;
  readonly endDate?: Date;
  readonly startDate?: Date;
  readonly title?: string;
  readonly description?: string;
}
