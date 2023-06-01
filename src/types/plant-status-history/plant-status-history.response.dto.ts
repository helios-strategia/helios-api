import { PlantStatus } from '@/types/plant';

export interface PlantStatusHistoryResponseDto {
  readonly id: number;
  readonly createdAt: Date;
  readonly previousStatus: PlantStatus | null;
  readonly currentStatus: PlantStatus;
}
