import { BaseEntityResponseDto } from '@/api/base-entity/base-entity.response.dto';
import { PlantsEquipmentsEvents } from '@/api/plant-equipments-events/plants-equipments-events.entity';
import { PlantResponseDto } from '@/api/plant/dto';
import { AutoMap } from '@automapper/classes';
import { PlantEquipmentsType } from 'src/types/plant-equipments';

export class PlantEquipmentsResponseDto extends BaseEntityResponseDto {
  @AutoMap()
  public readonly equipmentType: PlantEquipmentsType;
  @AutoMap(() => [PlantsEquipmentsEvents])
  public readonly plantsEquipmentsEvents: PlantsEquipmentsEvents[];
  @AutoMap(() => PlantResponseDto)
  public readonly plant: PlantResponseDto;
}
