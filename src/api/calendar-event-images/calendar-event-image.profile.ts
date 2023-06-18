import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, Mapper, MappingProfile } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { CalendarEventImage } from '@/api/calendar-event-images/calendar-event-image.entity';
import { CalendarEventImageResponseDto } from '@/api/calendar-event-images/dto';

@Injectable()
export class CalendarEventImageProfile extends AutomapperProfile {
  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, CalendarEventImage, CalendarEventImageResponseDto);
    };
  }

  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }
}
