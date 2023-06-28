import { AutoMap } from '@automapper/classes';
import { PlantStatus } from '@/types/plant/plant-status.enum';
import { CalendarEvent } from '@/api/calendar-event/calendar-event.entity';
import { Employee } from '@/api/employee/employee.entity';
import {
  PlantProductivityDeclineRate,
  PlantResponseDto as PlantResponseDtoType,
} from '@/types/plant';
import { PlantStatusHistoryResponseDto } from '@/api/plant-status-history/dto';
import { BaseEntityResponseDto } from '@/api/base-entity/base-entity.response.dto';
import { UserResponseDto } from '@/api/user/dto/user.response.dto';
import { PlantDocumentResponseDto } from '@/api/plant-document/plant-document.response.dto';
import { PlantImagesResponseDto } from '@/api/plant-images/dto/plant-images.response.dto';

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

  @AutoMap(() => [PlantDocumentResponseDto])
  public readonly documents?: PlantDocumentResponseDto[];

  @AutoMap()
  public readonly employees?: Employee[];

  @AutoMap(() => [PlantStatusHistoryResponseDto])
  public readonly plantStatusHistory?: PlantStatusHistoryResponseDto[];

  @AutoMap(() => UserResponseDto)
  public readonly user?: UserResponseDto;

  @AutoMap()
  public readonly locationLongitude: number | null;

  @AutoMap()
  public readonly locationLatitude: number | null;

  @AutoMap(() => Object)
  public readonly plantProductivityDeclineRate: PlantProductivityDeclineRate | null;

  @AutoMap()
  public readonly contactPersonName: string | null;

  @AutoMap()
  public readonly contactPersonPhone: string | null;

  @AutoMap()
  public readonly contactPersonEmail: string | null;

  @AutoMap(() => [PlantImagesResponseDto])
  public readonly images?: PlantImagesResponseDto[];

  @AutoMap()
  public readonly address: string | null;

  @AutoMap()
  public readonly VATNumber?: number;

  @AutoMap()
  public readonly mainPlanUrl: string | null;

  @AutoMap()
  public readonly taxStatementUrl: string | null;
}
