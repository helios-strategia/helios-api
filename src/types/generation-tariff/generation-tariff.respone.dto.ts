import { BaseEntity } from '@/types/base-entity';
import { Quarter } from '@/types/common';

export interface GenerationTariffResponseDto extends BaseEntity {
  readonly year: number;
  readonly quarter: Quarter;
  readonly costPerKilowattHour: number;
  readonly plantId: number;
}
