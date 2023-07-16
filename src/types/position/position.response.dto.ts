import { BaseEntity } from '@/types/base-entity';
import { Employee } from '@/api/employee/employee.entity';

export interface PositionResponseDto extends BaseEntity {
  readonly name: string;
  readonly description: string | null;
  readonly employees?: Employee[];
}
