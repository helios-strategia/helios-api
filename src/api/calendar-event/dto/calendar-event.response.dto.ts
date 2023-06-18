import {
  CalendarEventResponseDto as CalendarEventResponseDtoType,
  CalendarEventType,
} from '@/types/calendar-event';
import { CalendarEventPauseResponseDto } from '@/api/calendar-event-pause/dto/calendar-event-pause-response.dto';
import { CalendarEventImageResponseDto } from '@/api/calendar-event-images/dto';
import { BaseEntityResponseDto } from '@/api/base-entity/base-entity.response.dto';

export class CalendarEventResponseDto
  extends BaseEntityResponseDto
  implements CalendarEventResponseDtoType
{
  public readonly calendarEventType: CalendarEventType;
  public readonly description: string | null;
  public readonly endDate: Date;
  public readonly startDate: Date;
  public readonly title: string;
  public readonly pauses: CalendarEventPauseResponseDto[];
  public readonly images: CalendarEventImageResponseDto[];
}
