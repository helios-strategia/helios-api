import { PlantStatus } from './plant-status.enum';
import { PlantProductivityDeclineRateRequestDto } from './plant-productivity-decline-rate.request.dto';
import { MemoryStoredFile } from 'nestjs-form-data';

export interface PlantCreateRequestDto {
  readonly ascmePlantCode: string;
  readonly userId: number;
  readonly name: string;
  readonly dcPower?: number;
  readonly acPower?: number;
  readonly pvsystGenerationPlan?: number[];
  readonly documents?: MemoryStoredFile[];
  readonly documentTypes?: string[];
  readonly area?: number;
  readonly exploitationStart?: Date;
  readonly status?: PlantStatus;
  readonly locationLatitude?: number;
  readonly locationLongitude?: number;
  readonly employeesId?: number[];
  readonly plantProductivityDeclineRate?: PlantProductivityDeclineRateRequestDto[];
  readonly contactPersonName?: string;
  readonly contactPersonPhone?: string;
  readonly contactPersonEmail?: string;
  readonly address?: string;
  readonly VATNumber?: number;
  readonly images?: MemoryStoredFile[];
  readonly taxStatement?: MemoryStoredFile;
  readonly mainPlan?: MemoryStoredFile;
}
