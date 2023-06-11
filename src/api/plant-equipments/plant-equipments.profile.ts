import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, Mapper, MappingProfile } from '@automapper/core';
import { PlantEquipments } from '@/api/plant-equipments/plant-equipments.entity';
import { PlantEquipmentsResponseDto } from '@/api/plant-equipments/plant-equipments.response.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PlantEquipmentsProfile extends AutomapperProfile {
  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, PlantEquipments, PlantEquipmentsResponseDto);
    };
  }

  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }
}
