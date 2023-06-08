import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, Mapper, MappingProfile } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { PlantEquipmentsEventsImages } from '@/api/plant-equipments-events-images/plant-equipments-events-images.entity';
import { PlantEquipmentsEventsImagesResponseDto } from '@/api/plant-equipments-events-images/dto';

@Injectable()
export class PlantEquipmentsEventsImagesProfile extends AutomapperProfile {
  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(
        mapper,
        PlantEquipmentsEventsImages,
        PlantEquipmentsEventsImagesResponseDto,
      );
    };
  }

  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }
}
