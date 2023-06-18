import { Model30917Channel } from '../model-30917';

export interface DaysSumByChannelRequestDto {
  readonly plantId: number;
  readonly channels: Model30917Channel[];
  readonly dayStart: string;
  readonly dayEnd: string;
  readonly excludeSourcePoints?: number[];
}
