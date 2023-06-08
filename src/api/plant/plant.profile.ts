import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Plant } from '@/api/plant/plant.entity';
import { createMap, Mapper } from '@automapper/core';
import { PlantResponseDto } from '@/api/plant/dto/plant.response.dto';

@Injectable()
export class PlantProfile extends AutomapperProfile {
  override get profile() {
    return (mapper) => {
      createMap(mapper, Plant, PlantResponseDto);
    };
  }

  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }
}
