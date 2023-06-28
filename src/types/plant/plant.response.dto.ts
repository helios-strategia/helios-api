import { BaseEntity } from '@/types/base-entity';
import { PlantStatus } from '@/types/plant';
import { PlantStatusHistoryResponseDto } from '@/types/plant-status-history';
import { PlantProductivityDeclineRate } from '@/types/plant/plant-productivity-decline-rate';
import { UserResponseDto } from '@/types/user';
import { PlantDocumentResponseDto } from '@/types/plant-document';
import { CalendarEventResponseDto } from '@/types/calendar-event';
import { PlantImagesResponseDto } from '@/types/plant-images';

export interface PlantResponseDto extends BaseEntity {
  readonly ascmePlantCode: string;
  readonly name: string;
  readonly status: PlantStatus;
  readonly acPower: number | null;
  readonly dcPower: number | null;
  readonly pvsystGenerationPlan: number[] | null;
  readonly area: number | null;
  readonly exploitationStart: Date | null;
  readonly locationLongitude: number | null;
  readonly locationLatitude: number | null;
  readonly contactPersonName: string | null;
  readonly contactPersonPhone: string | null;
  readonly contactPersonEmail: string | null;
  readonly plantProductivityDeclineRate: PlantProductivityDeclineRate | null;
  readonly plantStatusHistory?: PlantStatusHistoryResponseDto[];
  readonly user?: UserResponseDto;
  readonly documents?: PlantDocumentResponseDto[];
  readonly calendarEvents?: CalendarEventResponseDto[];
  readonly address?: string;
  readonly VATNumber?: number;
  readonly taxStatementUrl?: string;
  readonly mainPlanUrl?: string;
  readonly images?: PlantImagesResponseDto[];
}
