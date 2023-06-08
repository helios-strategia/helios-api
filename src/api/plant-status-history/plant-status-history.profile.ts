import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, Mapper, MappingProfile } from '@automapper/core';
import { PlantStatusHistory } from '@/api/plant-status-history/plant-status-history.entity';
import { PlantStatusHistoryResponseDto } from '@/api/plant-status-history/dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PlantStatusHistoryProfile extends AutomapperProfile {
  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, PlantStatusHistory, PlantStatusHistoryResponseDto);
    };
  }

  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }
}
