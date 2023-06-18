import { Model30917Channel } from '../model-30917';

export type DayKvtPerHalfHourByChannelResponseDto = {
  readonly [channel in Model30917Channel]: {
    sum: number[];
    [sourcePointCode: number]: number[];
  };
};
