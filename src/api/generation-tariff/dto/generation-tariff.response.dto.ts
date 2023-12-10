import { GenerationTariffResponseDto as GenerationTariffResponseDtoType } from '@/types/generation-tariff';
import { BaseEntityResponseDto } from '@/api/base-entity/base-entity.response.dto';
import { AutoMap } from '@automapper/classes';
import { Quarter } from '@/types/generation-tariff/quarter';

export class GenerationTariffResponseDto
  extends BaseEntityResponseDto
  implements GenerationTariffResponseDtoType
{
  @AutoMap(() => Number)
  public readonly costPerKilowattHour: number;

  @AutoMap(() => Number)
  public readonly plantId: number;

  @AutoMap()
  public readonly quarter: Quarter;

  @AutoMap(() => Number)
  public readonly year: number;
}
