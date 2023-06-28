import { PlantResponseDto } from '@/api/plant/dto';
import { BaseImageResponseDto } from '@/api/base-image-entity/base-image.response.dto';
import { AutoMap } from '@automapper/classes';

export class PlantImagesResponseDto
  extends BaseImageResponseDto
  implements PlantImagesResponseDto
{
  @AutoMap(() => PlantResponseDto)
  public readonly plant?: PlantResponseDto;
}
