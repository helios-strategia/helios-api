import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, Mapper, MappingProfile } from '@automapper/core';
import { CalendarEventPause } from '@/api/calendar-event-pause/calendar-event-pause.entity';
import { CalendarEventPauseResponseDto } from '@/api/calendar-event-pause/dto/calendar-event-pause-response.dto';

export class CalendarEventPauseProfile extends AutomapperProfile {
  get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, CalendarEventPause, CalendarEventPauseResponseDto);
    };
  }

  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }
}
