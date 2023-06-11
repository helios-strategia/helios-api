import {
  PlantEquipmentEventGenerationAffects,
  PlantEquipmentsEventsResponseDto,
} from '@/types/plant-equipments-events';
import { PlantEquipmentsType } from 'src/types/plant-equipments';
import { BaseEntityResponseDto } from '@/api/base-entity/base-entity.response.dto';
import { AutoMap } from '@automapper/classes';
import { PlantEquipmentsEventsImagesResponseDto } from '@/api/plant-equipments-events-images/dto';

export class PlantsEquipmentsEventsResponseDto
  extends BaseEntityResponseDto
  implements PlantEquipmentsEventsResponseDto
{
  @AutoMap()
  public readonly location: string | null;

  @AutoMap()
  public readonly defectDescription: string;

  @AutoMap()
  public readonly specificationDescription;

  @AutoMap()
  public readonly startedAt: Date;

  @AutoMap()
  public readonly expectationEndAt?: Date;

  @AutoMap()
  public readonly generationAffectsType: PlantEquipmentEventGenerationAffects;

  @AutoMap(() => Number)
  public readonly plantId: number;

  @AutoMap()
  public readonly plantEquipmentType: PlantEquipmentsType;

  @AutoMap(() => [PlantEquipmentsEventsImagesResponseDto])
  public readonly plantEquipmentsEventsImages: PlantEquipmentsEventsImagesResponseDto[];
}
