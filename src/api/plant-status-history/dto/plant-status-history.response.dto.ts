import { PlantStatus } from '@/types/plant';
import { AutoMap } from '@automapper/classes';
import { PlantStatusHistoryResponseDto as PlantStatusHistoryResponseDtoType } from '@/types/plant-status-history';

export class PlantStatusHistoryResponseDto
  implements PlantStatusHistoryResponseDtoType
{
  @AutoMap()
  public readonly id: number;

  @AutoMap()
  public readonly createdAt: Date;

  @AutoMap()
  public readonly previousStatus: PlantStatus | null;

  @AutoMap()
  public readonly currentStatus: PlantStatus;
}
