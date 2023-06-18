import { Model30917Channel } from '@/types/model-30917';

export interface DayKvtPerHalfHourByChannelRequestDto {
  readonly plantId: number;
  readonly channels: Model30917Channel[];
  readonly day: string;
  readonly excludeSourcePoints?: number[];
}
