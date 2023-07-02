import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, Mapper } from '@automapper/core';
import { GenerationTariff } from '@/api/generation-tariff/generation-tariff.entity';
import { GenerationTariffResponseDto } from '@/api/generation-tariff/dto/generation-tariff.response.dto';

export class GenerationTariffProfile extends AutomapperProfile {
  public get profile() {
    return (mapper) => {
      createMap(mapper, GenerationTariff, GenerationTariffResponseDto);
    };
  }

  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }
}
