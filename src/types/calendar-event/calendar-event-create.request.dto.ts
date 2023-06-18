import { CalendarEventType } from '@/types/calendar-event/calendar-event-type.enum';
import { MemoryStoredFile } from 'nestjs-form-data';

export interface CalendarEventCreateRequestDto {
  readonly calendarEventType: CalendarEventType;
  readonly endDate: Date;
  readonly startDate: Date;
  readonly title: string;
  readonly plantId: number;
  readonly description?: string;
  readonly images?: MemoryStoredFile[];
}
