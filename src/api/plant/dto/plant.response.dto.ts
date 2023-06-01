import { AutoMap } from '@automapper/classes';
import { PlantStatus } from '@/types/plant/plant-status.enum';
import { CalendarEvent } from '@/api/calendar-event/calendar-event.entity';
import { PlantDocument } from '@/api/plant-document/plant-document.entity';
import { Employee } from '@/api/employee/employee.entity';
import {
  PlantProductivityDeclineRate,
  PlantResponseDto as PlantResponseDtoType,
} from '@/types/plant';
import { PlantStatusHistoryResponseDto } from '@/api/plant-status-history/dto';
import { BaseEntityResponseDto } from '@/api/base-entity/base-entity.response.dto';

export class PlantResponseDto
  extends BaseEntityResponseDto
  implements PlantResponseDtoType
{
  @AutoMap()
  public readonly acPower: number | null;

  @AutoMap()
  public readonly dcPower: number | null;

  @AutoMap(() => [Number])
  public readonly pvsystGenerationPlan: number[] | null;

  @AutoMap()
  public readonly area: number | null;

  @AutoMap()
  public readonly ascmePlantCode: string;

  @AutoMap()
  public readonly exploitationStart: Date | null;

  @AutoMap()
  public readonly name: string | null;

  @AutoMap()
  public readonly status: PlantStatus;

  @AutoMap()
  public readonly calendarEvents?: CalendarEvent[];

  @AutoMap()
  public readonly documents?: PlantDocument[];

  @AutoMap()
  public readonly employees?: Employee[];

  @AutoMap(() => [PlantStatusHistoryResponseDto])
  public readonly plantStatusHistory?: PlantStatusHistoryResponseDto[];

  @AutoMap()
  public readonly locationLongitude: number | null;

  @AutoMap()
  public readonly locationLatitude: number | null;

  @AutoMap()
  public readonly plantProductivityDeclineRate: PlantProductivityDeclineRate | null;

  @AutoMap()
  public readonly contactPersonName: string | null;

  @AutoMap()
  public readonly contactPersonPhone: string | null;

  @AutoMap()
  public readonly contactPersonEmail: string | null;
}
