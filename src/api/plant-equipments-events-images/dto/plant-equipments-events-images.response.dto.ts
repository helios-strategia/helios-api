import { BaseEntityResponseDto } from '@/api/base-entity/base-entity.response.dto';
import { AutoMap } from '@automapper/classes';
import { PlantEquipmentsEventsImagesResponseDto as PlantEquipmentsEventsImagesResponseDtoType } from '@/types/plant-equipments-events-images';

export class PlantEquipmentsEventsImagesResponseDto
  extends BaseEntityResponseDto
  implements PlantEquipmentsEventsImagesResponseDtoType
{
  @AutoMap()
  public readonly url: string;

  @AutoMap()
  public readonly name: string;
}
