import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, Mapper, MappingProfile } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { OperationImage } from '@/api/operation-image/operation-image.entity';
import { OperationImageResponseDto } from '@/api/operation-image/dto';

@Injectable()
export class OperationImageProfile extends AutomapperProfile {
  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, OperationImage, OperationImageResponseDto);
    };
  }

  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }
}
