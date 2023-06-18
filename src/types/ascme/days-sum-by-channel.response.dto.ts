import { Model30917Channel } from '@/types/model-30917';

export type DaysSumByChannelResponseDto = {
  readonly [channel in Model30917Channel]: number;
};
