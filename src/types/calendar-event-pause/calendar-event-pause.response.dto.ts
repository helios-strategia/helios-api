import { BaseEntity } from '@/types/base-entity';

export interface CalendarEventPauseResponseDto extends BaseEntity {
  readonly startAt: Date;
  readonly endAt: Date;
}
