import { OperationType } from '@/types/operation/operation-type';

export interface OperationUpdateRequestDto {
  readonly operationType?: OperationType;
  readonly endDate?: Date;
  readonly startDate?: Date;
  readonly title?: string;
  readonly description?: string;
}
