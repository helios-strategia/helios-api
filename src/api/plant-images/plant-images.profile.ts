import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, Mapper, MappingProfile } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { PlantImages } from '@/api/plant-images/plant-images.entity';
import { PlantImagesResponseDto } from '@/api/plant-images/dto/plant-images.response.dto';

@Injectable()
export class PlantImagesProfile extends AutomapperProfile {
  get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, PlantImages, PlantImagesResponseDto);
    };
  }

  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }
}
