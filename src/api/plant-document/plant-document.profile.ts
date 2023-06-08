import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, Mapper, MappingProfile } from '@automapper/core';
import { PlantDocument } from '@/api/plant-document/plant-document.entity';
import { PlantDocumentResponseDto } from '@/api/plant-document/plant-document.response.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PlantDocumentProfile extends AutomapperProfile {
  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, PlantDocument, PlantDocumentResponseDto);
    };
  }

  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }
}
