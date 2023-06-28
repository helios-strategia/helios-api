import { BaseEntity } from '@/types/base-entity';

export interface GenerationTariffResponseDto extends BaseEntity {
  readonly year: number;
  readonly quarter: number;
  readonly costPerKilowattHour: number;
  readonly plantId?: number;
}
