import { BaseEntityResponseDto } from '@/api/base-entity/base-entity.response.dto';
import { PlantResponseDto } from '@/api/plant/dto';
import { AutoMap } from '@automapper/classes';
import { PlantEquipmentsType } from 'src/types/plant-equipments';
import { PlantsEquipmentsEventsResponseDto } from '@/api/plant-equipments-events/dto';
import { PlantEquipmentsResponseDto as PlantEquipmentsResponseDtoType } from '@/types/plant-equipments';

export class PlantEquipmentsResponseDto
  extends BaseEntityResponseDto
  implements PlantEquipmentsResponseDtoType
{
  @AutoMap()
  public readonly equipmentType: PlantEquipmentsType;

  @AutoMap(() => [PlantsEquipmentsEventsResponseDto])
  public readonly plantsEquipmentsEvents: PlantsEquipmentsEventsResponseDto[];

  @AutoMap(() => PlantResponseDto)
  public readonly plant: PlantResponseDto;
}
