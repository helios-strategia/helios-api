import { BaseEntity } from '@/types/base-entity';
import { Quarter } from '@/types/generation-tariff/quarter';

export interface GenerationTariffResponseDto extends BaseEntity {
  readonly year: number;
  readonly quarter: Quarter;
  readonly costPerKilowattHour: number;
  readonly plantId: number;
}
