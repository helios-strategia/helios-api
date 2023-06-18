import { CalendarEventPauseResponseDto as CalendarEventPauseResponseDtoType } from '@/types/calendar-event-pause';
import { BaseEntityResponseDto } from '@/api/base-entity/base-entity.response.dto';
import { AutoMap } from '@automapper/classes';

export class CalendarEventPauseResponseDto
  extends BaseEntityResponseDto
  implements CalendarEventPauseResponseDtoType
{
  @AutoMap()
  public readonly startAt: Date;

  @AutoMap()
  public readonly endAt: Date;
}
