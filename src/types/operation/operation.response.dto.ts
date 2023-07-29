import { BaseEntity } from '@/types/base-entity';
import { OperationType } from '@/types/operation/operation-type';
import { OperationImageResponseDto } from 'src/types/operation-images';
import { CalendarEventPauseResponseDto } from '@/types/calendar-event-pause';

export interface OperationResponseDto extends BaseEntity {
  readonly operationType: OperationType;
  readonly description: string | null;
  readonly endDate: Date;
  readonly startDate: Date;
  readonly plantId: number;
  readonly title: string;
  readonly pauses?: CalendarEventPauseResponseDto[];
  readonly images?: OperationImageResponseDto[];
}
