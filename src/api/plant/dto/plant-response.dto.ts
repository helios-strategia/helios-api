import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';
import { PlantStatus } from '@/api/plant/plant-status.enum';
import { CalendarEvent } from '@/api/calendar-event/calendar-event.entity';
import { PlantDocument } from '@/api/plant-document/plant-document.entity';
import { Employee } from '@/api/employee/employee.entity';
import { PlantStatusHistory } from '@/api/plant-status-history/plant-status-history.entity';
import { PlantProductivityDeclineRate } from '@/api/plant/plant-types';

export class PlantResponseDto {
  @ApiProperty({ minimum: 1 })
  @AutoMap()
  public readonly id: number;

  @AutoMap()
  public readonly acPower: number;

  @AutoMap()
  public readonly dcPower: number;

  @AutoMap()
  public readonly pvsystGenerationPlan: number[];

  @AutoMap()
  area: number;

  @AutoMap()
  ascmePlantCode: string;

  @AutoMap()
  exploitationStart: Date;

  @AutoMap()
  name: string;

  @AutoMap()
  status: PlantStatus;

  @AutoMap()
  calendarEvents: CalendarEvent[];

  @AutoMap()
  documents: PlantDocument[];

  @AutoMap()
  employees: Employee[];

  @AutoMap()
  plantStatusHistory: PlantStatusHistory[];

  @AutoMap()
  public readonly locationLongitude: number | null;

  @AutoMap()
  public readonly locationLatitude: number | null;

  @AutoMap()
  userId: number;

  @AutoMap()
  plantProductivityDeclineRate: PlantProductivityDeclineRate;

  @AutoMap()
  public readonly contactPersonName: string;

  @AutoMap()
  public readonly contactPersonPhone: string;

  @AutoMap()
  public readonly contactPersonEmail: string;
}
