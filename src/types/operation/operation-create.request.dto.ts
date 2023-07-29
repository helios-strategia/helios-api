import { OperationType } from '@/types/operation/operation-type';
import { MemoryStoredFile } from 'nestjs-form-data';

export interface OperationCreateRequestDto {
  readonly operationType: OperationType;
  readonly endDate: Date;
  readonly startDate: Date;
  readonly title: string;
  readonly plantId: number;
  readonly description?: string;
  readonly images?: MemoryStoredFile[];
}
