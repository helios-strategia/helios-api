import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, Mapper, MappingProfile } from '@automapper/core';
import { CalendarEvent } from '@/api/calendar-event/calendar-event.entity';
import { CalendarEventResponseDto } from '@/api/calendar-event/dto/calendar-event.response.dto';

export class CalendarEventProfile extends AutomapperProfile {
  get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, CalendarEvent, CalendarEventResponseDto);
    };
  }

  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }
}
