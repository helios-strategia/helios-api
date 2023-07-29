import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, Mapper, MappingProfile } from '@automapper/core';
import { OperationPause } from '@/api/operation-pause/operation-pause.entity';
import { OperationPauseResponseDto } from '@/api/operation-pause/dto/operation-pause-response.dto';

export class OperationPauseProfile extends AutomapperProfile {
  get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, OperationPause, OperationPauseResponseDto);
    };
  }

  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }
}
