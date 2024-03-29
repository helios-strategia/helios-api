import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, Mapper, MappingProfile } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { PlantEquipmentsEvents } from '@/api/plant-equipments-events/plants-equipments-events.entity';
import { PlantsEquipmentsEventsResponseDto } from '@/api/plant-equipments-events/dto';

@Injectable()
export class PlantsEquipmentsEventsProfile extends AutomapperProfile {
  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(
        mapper,
        PlantEquipmentsEvents,
        PlantsEquipmentsEventsResponseDto,
      );
    };
  }

  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }
}
